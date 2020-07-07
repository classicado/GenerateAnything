import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MssqlService } from '../services/mssql.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    public sql : MssqlService
    ) {  
  }

  ngOnInit(): void { 

    console.log("Init Home");

//this.sql.query("") 
//    console.log( this.sql.query("") );

 			// var sql = window.require("mssql");
    //         // config for your database
    //         var config = {
    //             user: 'generator',
    //             password: 'Password1',
    //             server: 'MEDIAPC\\SQLEXPRESS01',  
    //             database: 'GeneratorDemo'  
    //         };

    //         // connect to your database
    //         sql.connect(config, function (err) {
            
    //             if (err){
    //               console.log(err);
    //             } else{
    //                 // create Request object
    //               var request = new sql.Request();
                     
    //               // query to the database and get the records
    //               request.query('select * from Users', function (err, recordset) {
                      
    //                   if (err) console.log(err);
    //                   else console.log(recordset);


    //                       //self.err = err;
    //                     //  self.recordset = recordset;
    //                   // send records as a response
    //                //   res.send(recordset);
                      
    //               });
    //             } 
    //         }); 


  }




  runSQLQuery(): void{
      console.log("Run in  Home page");

        this.sql.query("");
  }
}

