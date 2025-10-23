class ApiResponse{
    constructor( statuscode, data,massage = "Something went wrong" ) {

        this.statuscode = statuscode
        this.data = data
        this.massage = massage
        this.success = statuscode < 400
    }
}

export { ApiResponse }