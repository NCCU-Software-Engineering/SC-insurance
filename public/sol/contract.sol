pragma solidity ^0.4.7;

contract Annuity {
    
    //保險商adress
    address private companyAddress;
    //被保人adress
    address private insuredAddress;
    //時間伺服器address
    address private timerAddress;

    //保費(待填入*)
    uint money = 0;
    //部署時間
    uint deployTime;
    //紀錄時間
    uint nowTime;
    //撤銷期限
    uint revocationPeriod;
    //給付年金日
    uint payTime;
    
    string ver = "1.0.2";
	
    //合約狀態 0.未被確認 1.契撤期 2.確認並等待給付 3.結束給付 4.被撤銷
    uint status;
    string[5] statusStrings;
    //給付間隔 (待填入*)
    uint timeInterval = 1 years;
    
    //事件
    event PayEvent();
    event RevocationEvent();
    event RevocationMailEvent();
    event NotRevocationEvent();

    //建構子
    function Annuity(uint time) {
        
        companyAddress = msg.sender;
        insuredAddress = 0xE2320c12C71fb4a91d756d21507B33ee05F2f4C7;
        
        status = 0;
        //部署日期
        deployTime = time;
        nowTime = time;
        //給付年金日 (待填入*)
        payTime = nowTime + 20 years;
        
        statusStrings[0] = "unconfirmed";
        statusStrings[1] = "canBeRevoked";
        statusStrings[2] = "confirmed";
        statusStrings[3] = "end";
        statusStrings[4] = "Revocation";
    }
    
    function getCompanyAddress() constant returns (address) {
        return companyAddress;
    }
    function getInsurerAddress() constant returns (address) {
        return insuredAddress;
    }
    function getStatus() constant returns (string){
        return statusStrings[status];
    }
    
    function getNowTime() constant returns (uint){
        return nowTime;
    }
    function getRevocationPeriod() constant returns (uint){
        return revocationPeriod;
    }
    function getPayTime() constant returns (uint){
        return payTime;
    }
    
    //確認合約
    function confirme() {
        
        //由被保人帳號確認
        if(msg.sender != insuredAddress) {
            throw;
        }
        //保單尚未被確認
        if(status != 0) {
            throw;
        }
        //進入契約撤銷期
        status = 1;
        
        //設定契約撤銷期限
        revocationPeriod = nowTime + 10 days;
        //通知保險公司傳送契約撤銷確認email
        RevocationMailEvent();
    }
    
    function revoke() {
        
        //由被保人帳號確認
        if(msg.sender != insuredAddress) {
            throw;
        }
        //保單不能撤銷
        if(status != 1) {
            //通知保險公司合約不能撤銷
            NotRevocationEvent();
            throw;
        }
        //撤銷契約
        status = 4;
        //通知保險公司進行契約撤銷流程
        RevocationEvent();
    }
    
    //被保人死亡
    function endAnnuity() {
        //由保險公司取消
        if(msg.sender != companyAddress) {
            throw;
        }
        status = 3;
    }
    
    function time(uint time) {
        
        //紀錄時間
        nowTime = time;
        //由第三方時間伺服器設定時間
        if(msg.sender != timerAddress) {
            throw;  
        }
        //撤銷期結束
        if(status == 1) {
            if(nowTime >= revocationPeriod){
                status = 2;
            }
        }
        //開始給付年金
        else if(status == 2) {
            if(nowTime >= payTime){
                status = 2;
                //通知保險公司給付年金
                PayEvent();
            }
        }
    }
    //已經給付年金
    function finishPayment(){
        //下次給付時間
        payTime += timeInterval;
    }
    
    function version() constant returns(string) {
        return ver;
    }
    
    //摧毀合約
    function destroy() {
         if (msg.sender == companyAddress) { 
             suicide(companyAddress);
        }
    }
    
}