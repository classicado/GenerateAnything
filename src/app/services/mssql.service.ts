import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  
	constructor() {
		    
		mssql.connect(config).then(result => {
		    console.log("========== Connected ===========");
		    console.log(result);
		}).catch(err => {
		  	console.log(err);
		});
	   
    }

     query (s: string){  

            /*// connect to your database
            mssql.connect(config, function (err) {
            
                if (err) console.log(err);

                // create Request object
                var request = new mssql.Request();
                   
                // query to the database and get the records
                request.query(queryStringAllTables, function (err, recordset) {
                    
                    if (err) deferred.reject(err); 
					deferred.resolve(recordset); 
                });
            }); */
    }

    async getTables(): Promise<any>{
  
 		return new mssql.Request().query(queryStringAllTables); 
    }
 
}
