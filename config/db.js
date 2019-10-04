const DB_URL_LOCAL = 'mongodb://localhost:27017/eugeniucozac'; 

if(process.env.NODE_ENV === "production"){
  module.exports = {mongoURI : process.env.DB_URL_PROD}
}else{
  module.exports = {mongoURI : DB_URL_LOCAL}
}   