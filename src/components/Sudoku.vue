<template>
  <div>
    <button @click="makeSudoku">生成</button>
    <transition-group name="sudoku-group" tag="div" class="sudoku-group">
      <div v-for="item in sudoku" :key="item.key" class="sudoku-item">
        <span v-for="subItem in item.value" :key="subItem.key" class="sudoku-item-item">{{subItem.value}}</span>
      </div>
    </transition-group>
    <div class="sudoku-group">
      <div v-for="(item, index) in fillList" :key="index" class="sudoku-item">
        <span v-for="(subItem, subIndex) in item" :key="subIndex" class="sudoku-item-item">{{subItem}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  deepCopy
} from 'Utils/utils'
export default {
  name: 'Sudoku',
  data () {
    return {
      sudoku: [],
      sudokuCopy: [],
      fillList: [],
      fillListCopy: [],
    }
  },
  created () {
    this.sudoku = Array.from(Array(9), (item, index) => {
      return {
        key: index,
        value: Array.from(Array(9), (subItem, subIndex) => {
          return {
            key: `${index}${subIndex}`,
            value: (subIndex % 9) + 1
          }
        })
      }
    })
    this.sudokuCopy = deepCopy(this.sudoku)
    this.fillList = Array.from(Array(9), () => Array.from(Array(9)))
    this.fillListCopy = deepCopy(this.fillList)
  },
  methods: {
    makeSudoku () {
      this.fillList = deepCopy(this.fillListCopy)
      this.randomList(this.sudokuCopy).then(res => {
        this.sudoku = res
      })
    },
    async randomList (sudoku) {
      const sudokuCopy = deepCopy(sudoku)
      let length = sudokuCopy.length
      const finalList = [] // 最终结果
      while (length > 0) {
        const index = Math.floor(Math.random() * length)
        finalList.push(sudokuCopy[index])
        sudokuCopy.splice(index, 1)
        length = sudokuCopy.length
      }
      finalList.forEach(item => {
        item.value.forEach(subItem => {
          subItem.value = null
          subItem.found = false
        })
      })
      const arr = Array.from(Array(9), (item, index) => index + 1) // 九宫格小格 1-9
      const x = Array.from(Array(9), () => [])
      const y = Array.from(Array(9), () => [])

      let num = 0
      do {
        let bigTime = 0
        let i = 0
        let needBreak = false
        do {
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              let time = 0 // 只找9次
              let jCash = [] // 找过的位置
              let j = null, // 可以填的位置
                xTemp = [],
                yTemp = []
              if (i === 0) {
                if (finalList[0].value.filter(item => {
                  return !item.found
                }).length < 1) {
                  const numCash = num
                  num = numCash - 1 < 0 ? 0 : numCash - 1
                  this.fillList.forEach((item, index) => {
                    item.forEach((subItem, subIndex) => {
                      if (!subItem) finalList[index].value[subIndex].found = false
                      if ([arr[num], arr[numCash]].indexOf(subItem) > -1) {
                        this.$set(this.fillList[index], subIndex, null)
                        finalList[index].value[subIndex].value = null
                        finalList[index].value[subIndex].found = false
                        xTemp = x[Math.floor(subIndex / 3) + Math.floor(index / 3) * 3]
                        yTemp = y[(index % 3) * 3 + subIndex % 3]
                        xTemp.indexOf(subItem) && xTemp.splice(xTemp.indexOf(subItem), 1)
                        yTemp.indexOf(subItem) && yTemp.splice(yTemp.indexOf(subItem), 1)
                      }
                    })
                  })
                  resolve('break')
                  return
                }
              }
              do {
                time++
                j !== null && jCash.push(j)
                do {
                  j = Math.floor(Math.random() * 9)
                  if (jCash.length === 9) break
                } while (jCash.includes(j))
                if (time > 9) break
                xTemp = x[Math.floor(j / 3) + Math.floor(i / 3) * 3]
                yTemp = y[(i % 3) * 3 + j % 3]
              } while (xTemp.includes(arr[num]) || yTemp.includes(arr[num]) || finalList[i].value[j].value || (i === 0 && finalList[i].value[j].found))
              if (time > 9) {
                bigTime++
                const iCash = i
                i = iCash - (Math.floor(bigTime / 9) + 1) < 0 ? 0 : iCash - (Math.floor(bigTime / 9) + 1)
                if (i === 0) bigTime = 0
                for (let back = 1; back <= iCash - i; back++) {
                  this.fillList[iCash - back].forEach((item, index) => {
                    if (item === arr[num]) {
                      this.$set(this.fillList[iCash - back], index, null)
                      finalList[iCash - back].value[index].value = null
                      xTemp = x[Math.floor(index / 3) + Math.floor((iCash - back) / 3) * 3]
                      yTemp = y[((iCash - back) % 3) * 3 + index % 3]
                      xTemp.indexOf(arr[num]) && xTemp.splice(xTemp.indexOf(arr[num]), 1)
                      yTemp.indexOf(arr[num]) && yTemp.splice(yTemp.indexOf(arr[num]), 1)
                    }
                  })
                }
              } else {
                this.$set(this.fillList[i], j, arr[num])
                this.fillList[i][j] = arr[num]
                finalList[i].value[j].value = arr[num]
                if (i === 0) finalList[i].value[j].found = true
                xTemp.push(arr[num])
                yTemp.push(arr[num])
                i++
              }
              resolve(true)
            }, 0)
          }).then(res => {
            if (res === 'break') {
              needBreak = true
            } else {
              needBreak = false
            }
          })
        } while (i < finalList.length)
        if (needBreak) return
        num++
      } while (num < 9)
      return finalList
    },
  }
}
</script>

<style lang="less" scoped>
.sudoku-group {
  width: 300px;
  display: flex;
  flex-wrap: wrap;
  &:nth-of-type(2) {
    margin-top: 100px;
  }
  .sudoku-item:nth-of-type(2n) {
    background: rgb(187, 186, 186);
  }
  .sudoku-item:nth-of-type(2n + 1) {
    background: rgb(240, 240, 57);
  }
  .sudoku-item {
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    display: flex;
    flex-wrap: wrap;
    .sudoku-item-item {
      box-sizing: border-box;
      width: calc(100px / 3);
      height: calc(100px / 3);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.sudoku-group-move {
  transition: transform 1s;
}
</style>
