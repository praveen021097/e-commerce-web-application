class ApiFeatures {
    constructor(query,queryStr){
        this.query=query;
        this.queryStr =queryStr;

    }

    search(){
        const keyword = this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            },
        }:{};

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        //filter by category
        const queryCopy = {...this.queryStr};

        const removeFields = ["keyword","page","limit"];
       
        removeFields.forEach((key)=>delete queryCopy[key]);
        //filter by price
       let queryStr = JSON.stringify(queryCopy);
       queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=> `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
       
        return this;
    }
    // pagination

    pagination(resultPerPage){
            const currentPage = Number(this.queryStr.page) || 1;
            const skip = (currentPage-1)*resultPerPage;

            this.query = this.query.limit(resultPerPage).skip(skip).lean().exec();
            return this
    }

}

module.exports = ApiFeatures;