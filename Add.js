const add = (arr) => {
    arr.map((item) => {
        if (item % 2 == 0){
            console.log(item);
        }
    });
};

module.exports = add;