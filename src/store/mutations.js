export let state={
    userInfo:localStorage.getItem("userInfo")?JSON.parse(sessionStorage.getItem("userInfo")):{}
}
export let getters={
   userInfo(state){
       return state.userInfo
   }
}
export let mutations={
    changeUserInfo(state,obj){
        state.userInfo = obj;
        if(obj.username){
            localStorage.setItem("userInfo",JSON.stringify(obj))
        }else{
            localStorage.removeItem("userInfo")
        }
    }
}