// required field not given
export default (myfunErr)=>(req,res,next)=>{
  Promise.resolve(myfunErr(req,res,next)).catch(next);
}