$(function() {
    const jpdbBaseURL = 'http://api.login2explore.com:5577';
    const schoolDBName = 'SCHOOL-DB';
    let connToken = '90933122|-31949318680099241|90951257';
  
    $('#rollno').focus();
  
    function saveRecNo2LS(jsonObj) {
      const lvData = jsonObj.data;
      localStorage.setItem('recno', lvData.rec_no);
    }
  
    function getEmpIdAsJsonObj() {
      const rollno = $('#rollno').val();
      return JSON.stringify({ id: rollno });
    }
  
    function fillData(jsonObj) {
      if (jsonObj.data) {
        saveRecNo2LS(jsonObj);
        const record = jsonObj.data.record;
        $('#name').val(record.name);
        $('#Sclass').val(record.class);
        $('#bdate').val(record.birthdate);
        $('#address').val(record.address);
        $('#enrollment').val(record.enrollment);
      } else {
        console.log('No data found');
      }
    }
  
    function resetData() {
      $('#rollno').val('');
      $('#name').val('');
      $('#Sclass').val('');
      $('#bdate').val('');
      $('#address').val('');
      $('#enrollment').val('');
      $('#rollno').prop('disabled', false);
      $('#save').prop('disabled', true);
      $('#change').prop('disabled', true);
      $('#reset').prop('disabled', true);
      $('#rollno').focus();
    }
  
    function validateData() {
      const rollno = $("#rollno").val();
      const name = $("#name").val();
      const sClass = $("#Sclass").val();
      const bdate = $("#bdate").val();
      const address = $("#address").val();
      const enrollment = $("#enrollment").val();
  
      if (rollno === '') {
        alert("Student Roll number is missing");
        $("#rollno").focus();
        return '';
      }
      if (name === '') {
        alert("Student name is missing");
        $("#name").focus();
        return '';
      }
      if (sClass === '') {
        alert("Student class is missing");
        $("#Sclass").focus();
        return '';
      }
      if (bdate === '') {
        alert("Student birth date is missing");
        $("#bdate").focus();
        return '';
      }
      if (address === '') {
        alert("Student address is missing");
        $("#address").focus();
        return '';
      }
      if (enrollment === '') {
        alert("Student enrollment is missing");
        $("#enrollment").focus();
        return '';
      }
  
      const jsonStrObj = {
        rollno: rollno,
        name: name,
        class: sClass,
        birthdate: bdate,
        address: address,
        enrollment: enrollment
      };
      return JSON.stringify(jsonStrObj);
    }
  
    function createGETRequest(token, dbName, jsonObj) {
      return {
        url: jpdbBaseURL + '/api/irl',
        type: 'POST',
        data: {
          token: token,
          cmd: 'GET',
          db: dbName,
          q: jsonObj
        },
        success: function(response) {
          fillData(response);
        },
        error: function(error) {
          console.log('Error:', error);
        }
      };
    }
  
    function createPUTRequest(token, jsonObj, dbName) {
      return {
        url: jpdbBaseURL + '/api/iml',
        type: 'POST',
        data: {
          token: token,
          cmd: 'PUT',
          db: dbName,
          data: jsonObj
        },
        success: function(response) {
          console.log('Data saved successfully!');
        },
        error: function(error) {
          console.log('Error:', error);
        }
      };
    }
  
    function createUPDATERecordRequest(token, jsonObj, dbName, recno) {
      return {
        url: jpdbBaseURL + '/api/iml',
        type: 'POST',
        data: {
          token: token,
          cmd: 'UPDATE',
          db: dbName,
          data: jsonObj,
          rec_no: recno
        },
        success: function(response) {
          console.log('Data updated successfully!');
        },
        error: function(error) {
          console.log('Error:', error);
        }
      };
    }
  
    function getstu() {
      var rollnoJsonObj = getEmpIdAsJsonObj();
      var getRequest = createGETRequest(connToken, schoolDBName, rollnoJsonObj);
      $.post(getRequest);
    }
  
    function saveData() {
      var jsonStrObj = validateData();
      if (jsonStrObj === '') {
        return;
      }
      var putRequest = createPUTRequest(connToken, jsonStrObj, schoolDBName);
      $.post(putRequest);
      resetData();
    }
  
    function changeData() {
      $('#change').prop("disabled", true);
      var jsonChg = validateData();
      if (jsonChg === '') {
        return;
      }
      var recno = localStorage.getItem('recno');
      var updateRequest = createUPDATERecordRequest(connToken, jsonChg, schoolDBName, recno);
      $.post(updateRequest);
      resetData();
    }
  

    $('#rollno').on('change', getstu);
    $('#save').on('click', saveData);
    $('#change').on('click', changeData);
    $('#reset').on('click', resetData);
});  