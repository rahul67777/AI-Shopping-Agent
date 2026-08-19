// function isPrime(n) {
//     if (n < 2) return false;

//     for (let i = 2; i <= Math.sqrt(n); i++) {
//         if (n % i === 0) {
//             return false;
//         }
//     }

//     return true;
// }

// console.log(isPrime(17));
// console.log(isPrime(10));

// function isPrime(n) {
//     if(n<2) return false;
//     for(let i =2; i<=Math.sqrt(n); i++){
//         if(n % i === 0){
//             return false;
//         }
//     }
//     return true;
// }
// console.log(isPrime(17));
// console.log(isPrime(10));


function palimdrom(str){
    let reversedStr = str.split("").reverse().join("");
    return str === reversedStr;
}

console.log(palimdrom("madam"));