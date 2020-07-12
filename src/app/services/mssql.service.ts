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
		     console.log(mssql);
		}).catch(err => {
			console.log(mssql);
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

	async getTableColumns(tableName:string): Promise<any>{ 

		var q = "Select C.COLUMN_NAME" +
                    ", C.DATA_TYPE" +
                    ", C.CHARACTER_MAXIMUM_LENGTH " +
                    ", C.NUMERIC_PRECISION, C.NUMERIC_SCALE " +
                    ", C.IS_NULLABLE " +
                    ", Case When ( Z.CONSTRAINT_NAME Is Null AND Z.CONSTRAINT_TYPE = 'PRIMARY KEY') Then 0 Else (Case When ( Z.CONSTRAINT_TYPE = 'PRIMARY KEY') Then 1 Else 0 End) End As IsPartOfPrimaryKey " +
                    ", Z.* " +
                    "From INFORMATION_SCHEMA.COLUMNS As C " +
                    "Outer Apply ( " +
                    "    Select CCU.CONSTRAINT_NAME " +
                    "   ,TC.CONSTRAINT_TYPE   " +
                    "    ,KCU.table_name AS TARGET_TABLE " +
                    "    ,KCU.column_name AS TARGET_COLUMN " +
                    "    From INFORMATION_SCHEMA.TABLE_CONSTRAINTS As TC " +
                    "    JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE As CCU " +
                    "            On CCU.CONSTRAINT_NAME = TC.CONSTRAINT_NAME   " +
                    "    LEFT JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS RC " +
                    "        ON CCU.CONSTRAINT_NAME = RC.CONSTRAINT_NAME " +
                    "    LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU " +
                    "        ON KCU.CONSTRAINT_NAME = RC.UNIQUE_CONSTRAINT_NAME   " +
                    "    Where TC.TABLE_SCHEMA = C.TABLE_SCHEMA " +
                    "        And TC.TABLE_NAME = C.TABLE_NAME  " +
                    "        And CCU.COLUMN_NAME = C.COLUMN_NAME  " +
                    "    ) As Z " +
                    " Where C.TABLE_NAME = '" + tableName+ "'";

 		return new mssql.Request().query( q );  
    }

	openConnection(): void{
		console.log("========== Opening connection ===========");
   		mssql.connect(config).then(result => {
		    console.log("========== Connected ===========");
		    console.log(result);
		     console.log(mssql);
		}).catch(err => {
		  	console.log(err);
		});
    }
   closeConnection(): void{
   		mssql.close();
    }
}
