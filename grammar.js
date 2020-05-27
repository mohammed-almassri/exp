class Production{
  constructor(left){
    this.left = left;
    this.right = [];
  }
  add(...t){
    this.right.push(t);
    return this;
  }
  toString(){
    let ret = '';
    for (const right of this.right) {
        ret += `${this.symbol} -> ${right.join(',')}`
    }
    return ret;
  }
  static endChar(){
    return '$';
  }
  static emptyChar(){
    return 'ϵ';
  }
}

class LRProduction{
  constructor(production){
    this.left = production.left;
    this.right = production.right.map(i=>{
     i.unshift(LRProduction.item()); return i});
  }
  static nextProduction(prod){
    const itemIndex = prod.indexOf(LRProduction.item());
    if(itemIndex==-1||itemIndex==prod.length-1){
      return undefined;
    }
    prod[itemIndex] = prod[itemIndex+1];
    prod[itemIndex+1] = LRProduction.item();
    return prod;
  }
  static item(){
    return '•'
  }
}

// class Terminal{
//   constructor(symbol){
//     this.symbol = symbol;
//   }
//   static epsilon(){
//     return '`';
//   }
// }

// class NonTerminal{
//   constructor(symbol){
//     this.symbol = symbol;
//   }
// }

const n = '1234567890qwertyuioplkjhgfdsazxcvbnm!@#$%^&*()-={}[]\'\":;<>,./?\\|';
// const N = {};
// for (const i of n) {
//   N[i] = new Terminal(i);
// }
// console.log(N);

const charIn = (i, s) => {
  return s.indexOf(i) !== -1;
};

const p=a=>new Production(a)

// const grammar = {
//   S:p('S').add('E',Production.endChar()),
//   E: p('E').add('T','E_'),
//   E_: p('E_').add('+','T','E_').add('-','T','E_').add(Production.emptyChar()),
//   T: p('T').add('F','T_'),
//   T_: p('T_').add('*','F','T_').add('/','F','T_').add(Production.emptyChar()),
//   F: p('F').add('(','E',')').add('id'),
// }

// const grammar = {
//   S_:p('S_').add('S',Production.endChar()),
//   S:p('S').add('(','S',')').add(Production.emptyChar()),
// }
  

// const grammar = {
//   S_:p('S_').add('S',Production.endChar()),
//   S:p('S').add('A','C','B').add('C','b','B').add('B','a'),
//   A:p('A').add('d','a').add('B','C'),
//   B:p('B').add('g').add(Production.emptyChar()),
//   C:p('C').add('h').add(Production.emptyChar()),
// }
// const grammar = {
//   Z: p('Z').add('E',Production.endChar()),
//   E: p('E').add('T').add('E','+','T'),
//   T: p('T').add('i').add('(','E',')'),
// }

// const LRGrammar = {};

// for (let [key, value] of Object.entries(grammar)) {
//   LRGrammar[key] = new LRProduction(value);
// }


// const nextItemSet = (grammar, symbol) =>{
//   const ret = {};
//   for (let [key, value] of Object.entries(grammar)) {
//     value.right.forEach(prod => {
//       for (let i = 1; i < prod.length; i++) {
//         const element = prod[i];
//         const prev = prod[i-1];
//         if(prev==LRProduction.item() && element==symbol){
//           if(!ret[key]){
//             ret[key] = [];
//           }
//           ret[key].push(LRProduction.nextProduction(prod));
//           break;
//         }
//       }
//     });
//   }

//   if(symbol!=symbol.toLowerCase()){
//     grammar[symbol].right.forEach(prod=>{
//       const index = prod.indexOf(LRProduction.item());
//       const key = prod[index+1];
  
//       if(!ret[key]){
//         ret[key] = [];
//       }
//       ret[key].push(prod);
//     });
//   }
//   return ret;
// }


// const initialItemSet = (grammar)=>{
//   const ret = [];
//   Object.keys(grammar).forEach(key=>{
//     ret.push(grammar[key]);
//   })
//   return ret;
// }



const first = (grammar, t)=>{
  //first of a terminal is itself
  if(t.toLowerCase()==t){
    return [t];
  }
  const prod = grammar[t];
  const ret = [];
  //for each of the alternative right hand sides
  prod.right.forEach(c => {
    /*
      j is the index of the current symbol we are looking at
      we start at 0 to get the first of the left hand side
      if the first of the symbol at 0 contains an epsilon
      we increment j and look at the next symbol until we get one 
      that does not yield epsilon
      if all symbols yield epsilon we add it to the first of the current symbol
      and return the result
    */
    let j = 0, f, flag;
    do{
      f = [];
      flag = false;
      const i = c[j];
      f = first(grammar, i);
      flag = f.indexOf(Production.emptyChar())!=-1;
      if(flag){
        f = f.filter(x=>x!=Production.emptyChar());
      }
      ret.push(...f);
      //if the first of all the symbols in the left side contain epsilon
      if(j==c.length-1 && flag){
        //add epsilon to our current first
        ret.push(Production.emptyChar());
        break;
      }
      j++;
    } while(flag && j<c.length);
  });
  return ret.filter((value, index, self)=> self.indexOf(value) === index );
}


const follow = (grammar, t, visited=[]) =>{
  const ret = [];
  //to avoid infinite loops
  visited.push(t)
  //for all productions in this grammar
  for (const prods of Object.values(grammar)) {
    const left = prods.left;
    //for all the right hand sides in this production
    L1: for (const right of prods.right) {
      let tIndex = right.indexOf(t);
      //if our symbol is in this right hand side
      if(tIndex != -1){
        let f, flag;
        /*
          here we do a similar thing as in first()
          the follow of this symbol is the first of the 
          symbol next to it
          if the first of the symbol next to it contains epsilon 
          look at the symbol after that until the first of the symbol does
          not contain epsilon or there are no more symbols left
          if there are no more symbols left get the follow of the left hand side
        */
        do{
            //no more symbols
            if(tIndex == right.length -1){
              //we havent visited the left hand side yet
              if(visited.indexOf(left)==-1){
                //get the follow of the left side
                ret.push(...follow(grammar, left));
              }
              continue L1;
            } 
            const next = right[tIndex+1];
            f = first(grammar,next);
            flag = f.indexOf(Production.emptyChar())!=-1;
            if(flag){
              f = f.filter(x=>x!=Production.emptyChar());
            }
            ret.push(...f);
            tIndex++;
        }
        while(flag);
      }
    }
  }
  return ret.filter((value, index, self)=> self.indexOf(value) === index );
}

const table = (grammar) =>{
  ret = {};
  for (const left of Object.keys(grammar)) {
    ret[left] = {};

  }
  for (const prods of Object.values(grammar)) {
    const left = prods.left;
    for (const right of prods.right) {
      let f = first(grammar,right[0]);
      if(f[0]==Production.emptyChar()){
        f = follow(grammar,left);
      }
      for (const t of f) {
        ret[left][t] = new Production(left).add(...right);
      }
    }
  }
  return ret;
}

const parse = (grammar, input)=>{
  const _table = table(grammar);
  const stack = [];
  stack.push('S');
  for (const c of input) {
    let top;
    while(true){
      top = stack[stack.length-1]
      if(top.toLowerCase()==top){
        break;
      }
      else{
        const prod = _table[top][c.lexeme];
        if(!prod){
          return 'error';
        }
        stack.pop();        
        if(prod.right[0][0]!=Production.emptyChar()){
          stack.push(...prod.right[0].reverse());
          prod.right[0].reverse()
        }
      }
    }
    if(top==c.lexeme){
      stack.pop();
    }
    else{
      return "error";
    }
  }
  return "Yes";
}

const tokenEquals = (target, token)=>{

}

// console.log(JSON.stringify(table(grammar)));

// console.log(first(grammar,'E'));

console.log(parse(grammar,"id + id - id $".split(' ').map(x=>({lexeme:x}))));
