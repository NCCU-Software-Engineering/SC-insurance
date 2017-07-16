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
    string _beneficiary;
    //身故受益人
    string _deathBeneficiary;

    //部署時間
    uint[3] _deployTime;
    //紀錄時間
    uint[3] _nowTime;
    //撤銷期限
    uint[3] _revocationPeriod;
    //給付年金日
    uint[3] _paymentDate;

    //合約狀態
    //等待付款未被確認 契撤期 確認並等待給付 結束給付 被撤銷
    enum State{waitingForPayment, unconfirmed, canBeRevoked, confirmd, ending, revocation}
    State public _state;

    modifier inState(State state) {
        if (_state != state) throw;
        _;
    }

    //事件
    event confirmEvent(address from, string inf, uint timestamp);
    event revokeEvent(address from, string inf, uint timestamp);
    event payEvent(address from, string inf, uint timestamp);

    //建構子
    function Annuity(uint[3] Date, uint payment, uint[3] paymentDate, string beneficiary, string deathBeneficiary) {

        _companyAddress = msg.sender;
        _insuredAddress = 0xE2320c12C71fb4a91d756d21507B33ee05F2f4C7;

        _payment = payment;
        _timeInterval = 1;
        _beneficiary = beneficiary;
        _deathBeneficiary = deathBeneficiary;

        //部署日期
        _deployTime = [Date[0], Date[1], Date[2]];
        //合約日期
        _nowTime = [Date[0], Date[1], Date[2]];
        //給付年金日
        _paymentDate = [paymentDate[0], paymentDate[1], paymentDate[2]];
    }

    function getState() constant returns (uint){
        return uint(_state);
    }

    function getCompanyAddress() constant returns (address) {
        return _companyAddress;
    }
    function getInsurerAddress() constant returns (address) {
        return _insuredAddress;
    }

    function getPayment() constant returns (uint) {
        return _payment;
    }
    function getGuaranteePeriod() constant returns (uint) {
        return _guaranteePeriod;
    }
    function getTimeInterval() constant returns (uint) {
        return _timeInterval;
    }
    function getBeneficiarie() constant returns (string) {
        return _beneficiary;
    }
    function getDeathBeneficiary() constant returns (string) {
        return _deathBeneficiary;
    }

    function getDeployTime() constant returns (uint[3]) {
        return _deployTime;
    }
    function getNowTime() constant returns (uint[3]) {
        return _nowTime;
    }
    function getRevocationPeriod() constant returns (uint[3]) {
        return _revocationPeriod;
    }
    function getPaymentDate() constant returns (uint[3]) {
        return _paymentDate;
    }

    function payment() payable {
        if (_state != State.waitingForPayment) {
            throw;
        }
        _state = State.unconfirmed;
    }

    //確認合約
    function confirm(uint year, uint month, uint day) {

        //由被保人帳號確認
        //if(msg.sender != insuredAddress) {
        //    throw;
        //}

        //保單尚未被確認
        if(_state != State.unconfirmed) {
            confirmEvent(msg.sender , "error state", now);
        }
        else {
            //進入契約撤銷期
            _state = State.canBeRevoked;

            //設定契約撤銷期限
            _revocationPeriod = [year, month, day];

            //通知保險公司傳送契約撤銷確認email
            confirmEvent(msg.sender , "confirm success", now);
        }
    }

    //撤銷合約
    function revoke() {

        //由被保人帳號確認
        //if(msg.sender != insuredAddress) {
        //    throw;
        //}

        //保單不能撤銷
        if(_state != State.canBeRevoked) {
            //通知保險公司合約不能撤銷
            revokeEvent(msg.sender , "error state", now);
        }
        else {
            //撤銷契約
            _state = State.revocation;
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
        _state = State.ending;
    }

    function time(uint year, uint month, uint day) {

        //由第三方時間伺服器設定時間
        //if(msg.sender != timerAddress) {
        //    throw;
        //}

        //紀錄時間
        _nowTime = [year, month, day];

        //撤銷期結束
        if(_state == State.canBeRevoked) {
            if((year>_revocationPeriod[0]) ||
                (year==_revocationPeriod[0] && month>_revocationPeriod[1]) ||
                (year==_revocationPeriod[0] && month==_revocationPeriod[1] && day>=_revocationPeriod[2])){
                _state = State.confirmd;
            }
        }
        //開始給付年金
        else if(_state == State.confirmd) {
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
