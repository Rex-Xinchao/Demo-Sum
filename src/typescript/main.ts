const num: number = 123;

function fn(arg: number, arg2: any): void {
  console.log(arg, arg2)
}

fn(num, [1, 2, 3, 4]);

interface IPerson {
  name: string
  age: number
  family: string[]
  sex: '男' | '女'
}

const person: IPerson = {
  name: 'rex',
  age: 25,
  family: ['爹', '娘'],
  sex: '男'
}

type IPerson2 = {
  name: string
  age: number
  family: string[]
  sex?: '男' | '女'
}

const person2: IPerson2 = person

function isRegExp (input: any): input is RegExp {
  return '[object RegExp]' === Object.prototype.toString.call(input);
}
