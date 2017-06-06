pragma solidity ^0.4.7;

contract Annuity {

    //保險商adress
    address private companyAddress;
    //被保人adress
    address private insuredAddress;
    //時間伺服器address
    address private timerAddress;

    //合約狀態
    uint status;
    //保費(待填入*)
    uint money;
    //部署時間
    uint[3] deployTime;
    //紀錄時間
    uint[3] nowTime;
    //撤銷期限
    uint[3] revocationPeriod;
    //給付年金日
    uint[3] payTime;

    string ver = "1.0.4";

    //合約狀態 0.未被確認 1.契撤期 2.確認並等待給付 3.結束給付 4.被撤銷    uint status;
    string[5] statusStrings;
    //給付間隔 (待填入*)
    uint timeInterval;

    //事件
    event confirmEvent(address from, string inf, uint timestamp);
    event revokeEvent(address from, string inf, uint timestamp);
    event payEvent(address from, string inf, uint timestamp);

    //建構子
    function Annuity(uint y, uint m, uint d) {

        companyAddress = msg.sender;
        insuredAddress = 0xE2320c12C71fb4a91d756d21507B33ee05F2f4C7;
        money = 1000;
        timeInterval = 1;
        status = 0;

        //部署日期
        deployTime = [y,m,d];
        nowTime = [y,m,d];
        //給付年金日 (待填入*)
        payTime = [y+20,m,d];

        statusStrings[0] = "unconfirmed";
        statusStrings[1] = "canBeRevoked";
        statusStrings[2] = "confirmd";
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

    function getDeployTime() constant returns (uint[3]){
        return deployTime;
    }
    function getNowTime() constant returns (uint[3]){
        return nowTime;
    }
    function getRevocationPeriod() constant returns (uint[3]){
        return revocationPeriod;
    }
    function getPayTime() constant returns (uint[3]){
        return payTime;
    }
    function getVersion() constant returns (string){
        return ver;
    }

    //確認合約
    function confirm(uint year, uint month, uint day) {

        //由被保人帳號確認
        //if(msg.sender != insuredAddress) {
        //    throw;
        //}

        //保單尚未被確認
        if(status != 0) {
            confirmeEvent(msg.sender , "not yet been confirmed", now);
        }
        else {
            //進入契約撤銷期
            status = 1;

            //設定契約撤銷期限
            revocationPeriod = [year, month, day];

            //通知保險公司傳送契約撤銷確認email
            confirmeEvent(msg.sender , "confirm success", now);
        }
    }

    function revoke() {

        //由被保人帳號確認
        //if(msg.sender != insuredAddress) {
        //    throw;
        //}

        //保單不能撤銷
        if(status != 1) {
            //通知保險公司合約不能撤銷
            revokeEvent(msg.sender , "Can not be revoked", now);
        }
        else {
            //撤銷契約
            status = 4;
            //通知保險公司進行契約撤銷流程
            revokeEvent(msg.sender , "revoke the contract", now);
        }
    }

    //被保人死亡
    function endAnnuity() {
        //由保險公司取消
        //if(msg.sender != companyAddress) {
        //    throw;
        //}
        status = 3;
    }

    function time(uint year, uint month, uint day) {

        //紀錄時間
        nowTime = [year, month, day];
        //由第三方時間伺服器設定時間
        //if(msg.sender != timerAddress) {
        //    throw;
        //}

        //撤銷期結束
        if(status == 1) {
            if((year>revocationPeriod[0]) ||
                (year==revocationPeriod[0] && month>revocationPeriod[1]) ||
                (year==revocationPeriod[0] && month==revocationPeriod[1] && day>=revocationPeriod[2])){
                status = 2;
            }
        }
        //開始給付年金
        else if(status == 2) {
            if((year>payTime[0]) ||
                (year==payTime[0] && month>payTime[1]) ||
                (year==payTime[0] && month==payTime[1] && day>=payTime[2])){

                payTime[0] += timeInterval;

                //通知保險公司給付年金
                payEvent(msg.sender , "pay annuity", now);
            }
        }
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
