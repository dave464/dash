$(document).ready(function() {
        var config = {
        // FIREBASE
         apiKey: "AIzaSyBPfwe1EXj_CDoGLVSnougb8ntqtJC7dKg",
  authDomain: "h2order-13d55.firebaseapp.com",
  databaseURL: "https://h2order-13d55-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "h2order-13d55",
  storageBucket: "h2order-13d55.appspot.com",
  messagingSenderId: "1074930917295",
  appId: "1:1074930917295:web:c5fcbeb45053ce6355d95a",
  measurementId: "G-3Z6R95RYGC"
    };    
    firebase.initializeApp(config); 
    
    var rowEliminated; //to capture the deleted row
    var rowEdited; //to capture the edited or updated row

    //constants value for the edit and delete icons    
    const iconEdit = '<svg class="bi bi-pencil-square"  width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
    const iconClear = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

    var db = firebase.database();
    var Waterstation = db.ref().child("inspection");
         
   
    var dataSet = [];//array to save the values of the inputs fields of the form

    moment().format('LL'); 
   
 
    var table = $('#tableInspection').DataTable({
               
                pageLength : 10,
                lengthMenu: [[10, 20, 30, 40, 50 -1], [10, 20, 30, 40, 50, 'all']],
                data: dataSet,

                
                columnDefs: [
                    {
                            
                        targets: [0], 

                        visible: false,
                         //hide the ID column which is the [0]                          
                    },

                
                    {
                        targets: -1,        
                        defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEdit btn btn-primary' data-toggle='tooltip' title='Edit'>"+iconEdit+"</button><button class='btnDelete btn btn-danger' style='margin-left:6px;' data-toggle='tooltip' title='Delete'>"+iconClear+"</button></div></div>"
                    }
                ],

                
                "createdRow":function(row,data,index){
                    if (data[2]== 'Passed')
                    {
                        $('td',row).eq(1).css({
                            
                            'color': 'green',
                        });
                    }


                   else if(data[2]== 'Failed')
                    {
                        $('td',row).eq(1).css({
                           
                            'color': 'red',
                        });
                    }
                }

                

            });


          

$('.edit').click(function(){
     
     $('#modalIns').modal('show');
  });



    Waterstation.on("child_added", data => {        
        dataSet = [data.key, data.child("Name").val(), data.child("Status").val(), data.child("date").val()];
        table.rows.add([dataSet]).draw();
    });
    Waterstation.on('child_changed', data => {           
        dataSet = [data.key, data.child("Name").val(), data.child("Status").val(), data.child("date").val()];
        table.row(rowEdited).data(dataSet).draw();
    });
    Waterstation.on("child_removed", function() {
        table.row(rowEliminated.parents('tr')).remove().draw();                     
    });
          
    $('form').submit(function(e){                         
        e.preventDefault();
        let id = $.trim($('#id').val());        
        let Name = $.trim($('#Name').val());
        let Status = $.trim($('#Status').val());         
        let date = $.trim($('#date').val());                         
        let idFirebase = id;        
        if (idFirebase == ''){                      
            idFirebase = Waterstation.push().key;
        };                
        data = {Name:Name, Status:Status, date:date};             
        updateData = {};
        updateData[`/${idFirebase}`] = data;
        Waterstation.update(updateData);
        id = '';        
        $("form").trigger("reset");
        $('#modalIns').modal('hide');
    });


     


    //Botones
    $('#btnNew').click(function() {
        $('#id').val('');        
        $('#Name').val('');
        $('#Status').val('');         
        $('#date').val('');      
        $("form").trigger("reset");
        $('#modalIns').modal('show');
    });     



    $("#tableInspection").on("click", ".btnEdit", function() {    
        rowEdited = table.row($(this).parents('tr'));           
        let row = $('#tableInspection').dataTable().fnGetData($(this).closest('tr'));               
        let id = row[0];
        console.log(id);
        let Name = $(this).closest('tr').find('td:eq(0)').text(); 
        let Status = $(this).closest('tr').find('td:eq(1)').text();        
        let date = parseInt($(this).closest('tr').find('td:eq(2)').text());        
        $('#id').val(id);        
        $('#Name').val(Name);
        $('#Status').val(Status);                
        $('#date').val(date); 
                       
        $('#modalIns').modal('show');


    });  
  
    $("#tableInspection").on("click", ".btnDelete", function() {   
        rowEliminated = $(this);
        Swal.fire({
        title: 'Are you sure you want to delete this record?',
        text: "This process cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete'
        }).then((result) => {
        if (result.value) {
            let row = $('#tableInspection').dataTable().fnGetData($(this).closest('tr'));            
            let id = row[0];            
            db.ref(`inspection/${id}`).remove()
            Swal.fire('Deleted!', 'The Data has been removed.','success')
        }
        })        
    });  


   

    
    
});


document.getElementById('save').onclick = function(){
    Swal.fire(
        'Save!',
        'The Data has been saved',
        'success'
      )
  };
  

