let promise2 = new Promise((resolve,reject) => {
    resolve(1)
}).then(()=>{
    return promise2; // x
})

promise2.then(data =>{
    console.log(data)
},err =>{
    console.log(err)
})