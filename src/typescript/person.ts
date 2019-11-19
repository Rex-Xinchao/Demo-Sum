let id: number = null;

const createId = (): number => {
  return id + 1
};

class Person {
  readonly type: string = 'Human';
  id: number;
  name: string;
  age: number;
  sex: '男' | '女' | '人妖';
  phone?: string;
  father?: { id: number, name: string };
  mother?: { id: number, name: string };
  children?: { id: number, name: string }[];

  constructor(id: number, name: string, age: number, sex: '男' | '女' | '人妖', phone?: string) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.sex = sex;
    this.phone = phone;
  }

  setFamilyMember(type: 'father' | 'mother' | 'children', Person: Person): void {
    if (type === 'children') {
      let Is_Exist: boolean = false;
      this[type].forEach(item => {
        if (item.name === Person.name) {
          Is_Exist = true
        }
      })
      Is_Exist && (this[type].push(Person))
    } else {
      this[type] = {id: this.id, name: Person.name}
    }
  }

  getFamilyMember(): object[] {
    let list: object[] = [];
    this.father && list.push(this.father);
    this.mother && list.push(this.mother);
    this.children && list.push(...this.children);
    return list
  }
}

class man extends Person {
  constructor(id: number, name: string, age: number, phone?: string) {
    super(id, name, age, '男', phone)
  }
}

class woman extends Person {
  constructor(id: number, name: string, age: number, phone?: string) {
    super(id, name, age, '女', phone)
  }
}

const Rex: Person = new Person(createId(), 'Rex', 25, '男', '086-13601935905');

const Jin: Person = new man(createId(), 'Jin', 45);

Rex.setFamilyMember('father', Jin);

Rex.getFamilyMember();

// 编译命令 npx tsc person.ts
