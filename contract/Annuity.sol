pragma solidity ^0.4.10;

contract Annuity {

    //保險公司adress
    address private _companyAddress;
    //被保人adress
    address private _insuredAddress;
    //死亡受益人adress
    address private _deathBeneficiaryAddress;
    //時間伺服器address
    address private _timerAddress;

    //保險金額-以太幣
    uint _payment;
    //給付次數
    uint _payTime;
    //是否保證
    bool _isGuarantee;
    //給付間隔
    uint _timeInterval;
    
    //保險公司
    string _company;
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
    
    //年金
    uint _annuity;
    
    //合約狀態
    //等待付款未被確認 契撤期 確認並等待給付 結束給付 被撤銷
    enum State{waitingForPayment, unconfirmed, canBeRevoked, confirmd, ending, revocation, guarantee}
    State public _state;

    modifier inState(State state) {
        require(_state == state);
        _;
    }

    //事件
    event buyEvent(address from, string inf, uint value, uint[3] timestamp);
    event confirmEvent(address from, string inf, uint[3] timestamp);
    event revokeEvent(address from, string inf, uint[3] timestamp);
    event payEvent(address from, string inf, uint value, uint payTime, uint[3] timestamp);
    event companyPayEvent(address from, string inf, uint value, uint payTime, uint[3] timestamp);
    event deathEvent(address from, string inf, uint value, uint payTime, uint[3] timestamp);
    //建構子 被保人account, 身故受益人accout, 部署時間, 保費, 年金, 給付年金日, 是否保證, 公司, 受益人, 身故受益人
    function Annuity(address insuredAddress, address deathBeneficiaryAddress, uint[3] date, uint payment, uint annuity, uint paymentDate, bool isGuarantee, string company, string beneficiary, string deathBeneficiary) {

        _companyAddress = msg.sender;
        _insuredAddress = insuredAddress;
        _deathBeneficiaryAddress = deathBeneficiaryAddress;

        _payment = payment;
        _timeInterval = 1;
        _isGuarantee = isGuarantee;
        
        _company = company;
        _beneficiary = beneficiary;
        _deathBeneficiary = deathBeneficiary;
        _payTime = 0;

        //部署日期
        _deployTime = [date[0], date[1], date[2]];
        //合約日期
        _nowTime = [date[0], date[1], date[2]];
        //給付年金日
        _paymentDate = [date[0]+paymentDate, date[1], date[2]];
        
        //年金
        _annuity = annuity;
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
    function getGuarantee() constant returns (bool) {
        return _isGuarantee;
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
    function gatPayTime() constant returns (uint) {
        return _payTime;
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
    
    function buy() payable {
        require(_state == State.waitingForPayment);
        
        if(msg.value >= _payment) {
            buyEvent(msg.sender , "success buy", msg.value, _nowTime);
            _state = State.unconfirmed;
        }
        else {
            buyEvent(msg.sender , "eth not enough", msg.value, _nowTime);
        }
    }

    //確認合約
    function confirm(uint year, uint month, uint day) {

        //由被保人帳號確認
        //if(msg.sender != insuredAddress) {
        //    throw;
        //}

        //保單尚未被確認
        if(_state != State.unconfirmed) {
            confirmEvent(msg.sender , "error state", _nowTime);
        }
        else {
            //進入契約撤銷期
            _state = State.canBeRevoked;

            //設定契約撤銷期限
            _revocationPeriod = [year, month, day];

            //通知保險公司傳送契約撤銷確認email
            confirmEvent(msg.sender , "success confirm", _nowTime);
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
            revokeEvent(msg.sender , "error state", _nowTime);
        }
        else {
            //把保費退還給被保人
            _insuredAddress.transfer(_payment);
            //撤銷契約
            _state = State.revocation;
            //通知保險公司進行契約撤銷流程
            revokeEvent(msg.sender , "revoke the contract", _nowTime);
        }
    }

    //被保人死亡
    function endAnnuity() {
        //由保險公司取消
        //if(msg.sender != companyAddress) {
        //    throw;
        //}

        //付款前死亡
        if(_state == State.waitingForPayment) {
             _state = State.ending;
        }
        //確認前死亡
        else if(_state == State.unconfirmed) {
            _state = State.ending;
            _insuredAddress.transfer(_payment);
            deathEvent(msg.sender , "death", 0, 0, _nowTime);
        }
        //契約撤銷期內死亡
        else if(_state == State.canBeRevoked) {
            //有保證
            if(_isGuarantee) {
                _deathBeneficiaryAddress.transfer(_payment);
                deathEvent(msg.sender , "death(thansfer to deathBeneficiary)", 0, 0, _nowTime);
            }
            //無保證
            else {
                _companyAddress.transfer(_payment);
                deathEvent(msg.sender , "death(thansfer to _companyAddress)", 0, 0, _nowTime);
            }
        }
        //合約正式生效後死亡
        else if(_state == State.confirmd) {
            //有保證且有剩餘保費
            if(_isGuarantee &&　(_payment - _annuity*_payTime) > 0) {
                _state = State.guarantee;
                deathEvent(msg.sender , "death", _payment - _annuity*_payTime, _payTime+1, _nowTime);
            }
            //無保證或無剩餘保費
            else {
                _state = State.ending;
                deathEvent(msg.sender , "death", 0, 0, _nowTime);
            }    
        }
        else {
            deathEvent(msg.sender , "error", 0, 0, _nowTime);
        }
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
                _companyAddress.transfer(_payment);
            }
        }
        //開始給付年金
        else if(_state == State.confirmd || _state == State.guarantee) {
            if((year>_paymentDate[0]) ||
                (year==_paymentDate[0] && month>_paymentDate[1]) ||
                (year==_paymentDate[0] && month==_paymentDate[1] && day>=_paymentDate[2])){

                payEvent(msg.sender, "Notify the insurance company to pay", _annuity, _payTime+1 , _nowTime);
            }
        }
    }
    
    function companyPay() payable{
        
        if(msg.value >= _annuity) {
            if(_state != State.guarantee){
                _insuredAddress.transfer(msg.value);
                _paymentDate[0] += _timeInterval;
                _payTime += 1;
                companyPayEvent(msg.sender , "company pay success", msg.value, _payTime, _nowTime);
            }
            else {
                _deathBeneficiaryAddress.transfer(msg.value);
                _paymentDate[0] += _timeInterval;
                _payTime += 1;
                _state = State.ending;
                companyPayEvent(msg.sender , "company pay deathBeneficiary success", msg.value, _payTime, _nowTime);
            }
        }
        else{
            companyPayEvent(msg.sender , "company pay error", 0, 0, _nowTime);
        }
    }    
    
    //設定被保人帳戶
    function setInsurerdAddress(address insuredAddress){
        _insuredAddress = insuredAddress;
    }
    
    //設定身故受益人帳戶
    function setDeathBeneficiaryAddress(address deathBeneficiaryAddress){
        _deathBeneficiaryAddress = deathBeneficiaryAddress;
    }
    
    //摧毀合約
    function destroy() {
         if (msg.sender == _companyAddress) {
             selfdestruct(_companyAddress);
        }
    }

}

