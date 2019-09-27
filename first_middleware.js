
function first_middleware(req, res, next){
    console.log('Aplying first MiddleWare');
    next();
}
module.exports = first_middleware;