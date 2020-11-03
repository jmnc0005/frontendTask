export const  checkSegment = (element) => {
    if (element.code % 1000000 == 0) return element
  }

export const  checkFamily = (element) => {
    if (element.code % 1000000 != 0 && element.code % 10000 == 0 ) return element
  }

export const  checkClass = (element) => {
    if (element.code % 10000 != 0 && element.code % 100 == 0) return element
  }

export const checkCommodity = (element) => {
    if (element.code % 100 != 0) return element
  }