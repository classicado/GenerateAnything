import { Injectable } from '@angular/core';


const mssql = window.require("mssql");
const config = {
	            user: 'generator',
			    password: 'Password1',
			    server: 'MEDIAPC\\SQLEXPRESS01',  
			    database: 'GeneratorDemo'  
	        };



const queryStringAllTables = "SELECT TABLE_NAME FROM Information_Schema.Tables where Table_Type = 'BASE TABLE' and not TABLE_NAME like '[_]%' order by TABLE_NAME";                             



@Injectable({
  providedIn: 'root'
})
export class MssqlService {

	connection: any;
/*
    constructor() {
        this.connection = sql.connect({
            user: 'generator',
		    password: 'Password1',
		    server: 'MEDIAPC\\SQLEXPRESS01',  
		    database: 'GeneratorDemo'  
        });

        this.connection.connect((err) => {
           if (err) {
             console.log('error connecting', err);
           }
        });
    }

    query(sql: string) {
        this.connection.query(sql, function(err, results, fields) {
            console.log('err', err);
            console.log('results', results);
            console.log('fields', fields);
        });
    }


    */
	constructor() {
    	// connect to your database 
	    try{
	    	this.connection = mssql.connect(config);
	    }
	    catch(err){
	    	console.log(err);
	    }  
    }

     query (s: string){ 


		


		// // query to the database and get the records
		// new this.connection.Request().query('select * from Users', function (err, recordset) {
		  
		//   if (err) console.log(err);
		//   else console.log(recordset);


		//       //self.err = err;
		//     //  self.recordset = recordset;
		//   // send records as a response
		// //   res.send(recordset);
		  

		// });

 // var queryStringTable = "Select C.COLUMN_NAME, C.DATA_TYPE, C.CHARACTER_MAXIMUM_LENGTH " +
 //                                    ", C.NUMERIC_PRECISION, C.NUMERIC_SCALE " +
 //                                    ", C.IS_NULLABLE " +
 //                                    ", Case When Z.CONSTRAINT_NAME Is Null Then 0 Else 1 End As IsPartOfPrimaryKey " +
 //                                    "From INFORMATION_SCHEMA.COLUMNS As C " +
 //                                    "Outer Apply ( " +
 //                                    "    Select CCU.CONSTRAINT_NAME " +
 //                                    "    From INFORMATION_SCHEMA.TABLE_CONSTRAINTS As TC " +
 //                                    "        Join INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE As CCU " +
 //                                    "            On CCU.CONSTRAINT_NAME = TC.CONSTRAINT_NAME " +
 //                                    "    Where TC.TABLE_SCHEMA = C.TABLE_SCHEMA " +
 //                                    "        And TC.TABLE_NAME = C.TABLE_NAME " +
 //                                    "        And TC.CONSTRAINT_TYPE = 'PRIMARY KEY' " +
 //                                    "        And CCU.COLUMN_NAME = C.COLUMN_NAME " +
 //                                    "    ) As Z " +
 //                                    " Where C.TABLE_NAME = '" + tableName + "'";

 
            // connect to your database
            mssql.connect(config, function (err) {
            
                if (err) console.log(err);

                // create Request object
                var request = new mssql.Request();
                   
                // query to the database and get the records
                request.query(queryStringAllTables, function (err, recordset) {
                    
                    if (err) console.log(err);


					console.log(recordset); 
                    // send records as a response
                    //res.send(recordset);
                    
                });
            }); 
    }
}
