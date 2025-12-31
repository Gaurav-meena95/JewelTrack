const validationInput = (data) => {
    try {
        for (let i in data){
            if (data[i] == undefined){
                return i
            }
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {validationInput}
