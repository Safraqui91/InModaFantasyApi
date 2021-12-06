const objHelpers = {};
//Metodo formateo de números
objHelpers.FormateoNumber = (num) => {
    try {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    } catch (Error) {
        console.log(Error);
    }
}

module.exports = objHelpers;