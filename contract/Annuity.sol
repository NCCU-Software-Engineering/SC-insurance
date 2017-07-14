pragma solidity ^0.4.7;

contract Annuity {

    //保險商adress
    address private _companyAddress;
    //被保人adress
    address private _insuredAddress;
    //時間伺服器address
    address private _timerAddress;

    //保險金額
    uint _payment;
    //保證期間
    uint _guaranteePeriod;
    //給付間隔
    uint _timeInterval;
    //受益人
    string _beneficiarie;

    //部署時間
    uint[3] _deployTime;
    //紀錄時間
    uint[3] _nowTime;
    //撤銷期限
    uint[3] _revocationPeriod;
    //給付年金日
    uint[3] _paymentDate;

    //合約狀態
    uint status;
    //合約狀態 0.未被確認 1.契撤期 2.確認並等待給付 3.結束給付 4.被撤銷    uint status;
    string[5] statusStrings;

    //事件
    event confirmEvent(address from, string inf, uint timestamp);
    event revokeEvent(address from, string inf, uint timestamp);
    event payEvent(address from, string inf, uint timestamp);

    //建構子
    function Annuity(uint y, uint m, uint d, uint payment, uint paymentDate, string beneficiarie) {

        _companyAddress = msg.sender;
        _insuredAddress = 0xE2320c12C71fb4a91d756d21507B33ee05F2f4C7;

        //部署日期
        _deployTime = [y,m,d];
        //合約日期
        _nowTime = [y,m,d];
        //給付年金日
        _paymentDate = [y+paymentDate,m,d];

        _payment = payment;
        //受益人
        _beneficiarie = beneficiarie;
        //給付間隔
        _timeInterval = 1;

        status = 0;
        statusStrings[0] = "unconfirmed";
        statusStrings[1] = "canBeRevoked";
        statusStrings[2] = "confirmd";
        statusStrings[3] = "end";
        statusStrings[4] = "Revocation";
    }

    function getCompanyAddress() constant returns (address) {
        return _companyAddress;
    }
    function getInsurerAddress() constant returns (address) {
        return _insuredAddress;
    }

    function getStatus() constant returns (string){
        return statusStrings[status];
    }

    function getPayment() constant returns (uint){
        return _payment;
    }
    function getBeneficiarie() constant returns (string){
        return _beneficiarie;
    }
    function getTimeInterval() constant returns (uint){
        return _timeInterval;
    }

    function getDeployTime() constant returns (uint[3]){
        return _deployTime;
    }
    function getNowTime() constant returns (uint[3]){
        return _nowTime;
    }
    function getRevocationPeriod() constant returns (uint[3]){
        return _revocationPeriod;
    }
    function getPaymentDate() constant returns (uint[3]){
        return _paymentDate;
    }

    //確認合約
    function confirm(uint year, uint month, uint day) {

        //由被保人帳號確認
        //if(msg.sender != insuredAddress) {
        //    throw;
        //}

        //保單尚未被確認
        if(status != 0) {
            confirmEvent(msg.sender , "not yet been confirmed", now);
        }
        else {
            //進入契約撤銷期
            status = 1;

            //設定契約撤銷期限
            _revocationPeriod = [year, month, day];

            //通知保險公司傳送契約撤銷確認email
            confirmEvent(msg.sender , "confirm success", now);
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
        _nowTime = [year, month, day];
        //由第三方時間伺服器設定時間
        //if(msg.sender != timerAddress) {
        //    throw;
        //}

        //撤銷期結束
        if(status == 1) {
            if((year>_revocationPeriod[0]) ||
                (year==_revocationPeriod[0] && month>_revocationPeriod[1]) ||
                (year==_revocationPeriod[0] && month==_revocationPeriod[1] && day>=_revocationPeriod[2])){
                status = 2;
            }
        }
        //開始給付年金
        else if(status == 2) {
            if((year>_paymentDate[0]) ||
                (year==_paymentDate[0] && month>_paymentDate[1]) ||
                (year==_paymentDate[0] && month==_paymentDate[1] && day>=_paymentDate[2])){

                _paymentDate[0] += _timeInterval;

                //通知保險公司給付年金
                payEvent(msg.sender , "pay annuity", now);
            }
        }
    }

    //摧毀合約
    function destroy() {
         if (msg.sender == _companyAddress) {
             suicide(_companyAddress);
        }
    }

}
