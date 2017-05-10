pragma solidity ^0.4.7;

contract Annuity {

    //�O�I��adress
    address private companyAddress;
    //�Q�O�Hadress
    address private insuredAddress;
    //�ɶ����A��address
    address private timerAddress;

    //�O�O(�ݶ�J*)
    uint money;
    //���p�ɶ�
    uint[3] deployTime;
    //�����ɶ�
    uint[3] nowTime;
    //�M�P����
    uint[3] revocationPeriod;
    //���I�~����
    uint[3] payTime;

    string ver = "1.0.3";

    //�X�����A 0.���Q�T�{ 1.���M�� 2.�T�{�õ��ݵ��I 3.�������I 4.�Q�M�P
    uint status;
    string[5] statusStrings;
    //���I���j (�ݶ�J*)
    uint timeInterval;

    //�ƥ�
    event confirmeEvent(address from, string inf, uint timestamp);
    event revokeEvent(address from, string inf, uint timestamp);
    event payEvent(address from, string inf, uint timestamp);

    //�غc�l
    function Annuity(uint y, uint m, uint d) {

        companyAddress = msg.sender;
        insuredAddress = 0xE2320c12C71fb4a91d756d21507B33ee05F2f4C7;
        money = 1000;
        timeInterval = 1;
        status = 0;

        //���p���
        deployTime = [y,m,d];
        nowTime = [y,m,d];
        //���I�~���� (�ݶ�J*)
        payTime = [y+20,m,d];

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

    //�T�{�X��
    function confirme(uint year, uint month, uint day) {

        //�ѳQ�O�H�b���T�{
        //if(msg.sender != insuredAddress) {
        //    throw;
        //}

        //�O��|���Q�T�{
        if(status != 0) {
            confirmeEvent(msg.sender , "The policy can not be repeated", now);
        }
        else {
          //�i�J�����M�P��
          status = 1;

          //�]�w�����M�P����
          revocationPeriod = [year, month, day];
          //�q���O�I���q�ǰe�����M�P�T�{email

          confirmeEvent(msg.sender , "The policy confirms success", now);
        }
    }

    function revoke() {

        //�ѳQ�O�H�b���T�{
        //if(msg.sender != insuredAddress) {
        //    throw;
        //}

        //�O�椣��M�P
        if(status != 1) {
            //�q���O�I���q�X������M�P
            revokeEvent(msg.sender , "No longer valid within the period of revocation", now);
        }
        else {
          //�M�P����
          status = 4;
          //�q���O�I���q�i�櫴���M�P�y�{
          revokeEvent(msg.sender , "Revocation is successful", now);
        }
    }

    //�Q�O�H���`
    function endAnnuity() {
        //�ѫO�I���q����
        //if(msg.sender != companyAddress) {
        //    throw;
        //}
        //status = 3;
    }

    function time(uint year, uint month, uint day) {

        //�����ɶ�
        nowTime = [year, month, day];
        //�ѲĤT��ɶ����A���]�w�ɶ�
        //if(msg.sender != timerAddress) {
        //    throw;
        //}

        //�M�P������
        if(status == 1) {
            if((year>revocationPeriod[0]) ||
                (year==revocationPeriod[0] && month>revocationPeriod[1]) ||
                (year==revocationPeriod[0] && month==revocationPeriod[1] && day>=revocationPeriod[2])){
                status = 2;
            }
        }
        //�}�l���I�~��
        else if(status == 2) {
            if((year>payTime[0]) ||
                (year==payTime[0] && month>payTime[1]) ||
                (year==payTime[0] && month==payTime[1] && day>=payTime[2])){

                payTime[0] += timeInterval;

                //�q���O�I���q���I�~��
                payEvent(msg.sender , "Pay annuity", now);
            }
        }
    }

    function version() constant returns(string) {
        return ver;
    }

    //�R���X��
    function destroy() {
         if (msg.sender == companyAddress) {
             suicide(companyAddress);
        }
    }

}
