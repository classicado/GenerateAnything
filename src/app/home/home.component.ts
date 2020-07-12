import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MssqlService } from '../services/mssql.service';
 
 import * as _ from "lodash"
import * as fs from 'fs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tablesList : any[];
  selectedDatabaseName:string;
  selectedTableName:string;
  selectedColumns:any[];

  constructor(
    private router: Router,
    public sql : MssqlService
    ) {  
  }

  ngOnInit(): void { 

    console.log("Init Home");

  this.runSQLQuery();
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



  connectDB(): void{
      console.log("Run in  Home page");

      this.sql.openConnection(); 
  }

  runSQLQuery(): void{
      console.log("Run in  Home page");

       this.selectedDatabaseName = this.sql.config.database;
      this.sql.query("");

      this.sql
      .getTables()
      .then( tables => { 

        console.log( "RESPONSE: " );
        console.log( tables );

        this.tablesList = tables.recordset;
        // for (let tableObj of tablesList) { 
        //   console.log( tableObj );
        //  // this.availableTables.push( tableObj.name ) 
        // }
      //  this.sql.closeConnection();
      }).catch(err => {
        console.log( err );
      });

      


  }

   selectedTable(tableName):void{

    this.selectedTableName = tableName;
    this.sql.getTableColumns(tableName)
    .then( cols=>{
 
        this.selectedColumns = cols.recordset;
        console.log( this.getOurGeneratorFriendlyTableColumns( cols.recordset));


    }).catch(err => {
            console.log( err );
    });
    
   }
    
    generateFiles() : void{ 
        this.GenerateProcs(
          this.selectedDatabaseName,
          this.selectedTableName,
          "spt_"+this.selectedTableName+"_",
          this.getOurGeneratorFriendlyTableColumns( this.selectedColumns ) 
        ); 

        this.GenerateModels(
          this.selectedDatabaseName,
          this.selectedTableName,
          "spt_"+this.selectedTableName+"_",
          this.getOurGeneratorFriendlyTableColumns( this.selectedColumns ) 
        ); 

    }


    getOurGeneratorFriendlyTableColumns( tableColumns): any{
        var columns = [];
 
        tableColumns.forEach(column => {
            var column_name = column["COLUMN_NAME"]; 
            var field_name = column_name;

            if ((field_name.length > 3) && (field_name.substring(0, 3) == "ipk"))
            {
                field_name = field_name.substring(3) + "_PK";
            }
            else if ((field_name.length > 3) && (field_name.substring(0, 3) == "ifk"))
            {
                field_name = field_name.substring(3) + "_FK";
            }
            else
            {
                field_name = field_name.substring(1);
            }

            var data_type = column["DATA_TYPE"];

            var is_nullable = column["IS_NULLABLE"];
            var is_PK = column["IsPartOfPrimaryKey"];

            var data_precision = column["CHARACTER_MAXIMUM_LENGTH"];
             
            columns.push( {
                column_name : column_name, 
                param_name : field_name ,
                data_type : data_type ,
                data_precision : data_precision ,
                is_PK : is_PK ,
                is_nullable : column["IS_NULLABLE"],
                foreign_table : column["TARGET_TABLE"],
                foregin_column : column["TARGET_COLUMN"],
                CheckboxSelected : column["CheckboxSelected"] || false
            });  
            

        });
         
        return columns;
    }


     GenerateModels( dbName: string,tableName: string,  modelName: string,columns: any) : void
        {
            var select_list_1 = "class " + tableName + " {\n\n";
             
            var select_list_2 = "\t"+ tableName +"({\n";
            var select_list_3 = "\t"+ tableName +".fromJson(Map<String, dynamic> json) {\n";
            var select_list_4 = "\tMap<String, dynamic> toJson() {\n";
                select_list_4 += "\t\tfinal Map<String, dynamic> data = new Map<String, dynamic>();\n";
            var select_list_5 = "\t@override\n\tString toString() {\n\t\treturn '";
            var endLine = "}\n";

            for (var i = 0; i < columns.length; i++)
            {
                columns[i].data_type = columns[i].data_type == "varchar"? "String":columns[i].data_type;
                columns[i].data_type = columns[i].data_type == "bit"? "bool":columns[i].data_type;
                columns[i].data_type = columns[i].data_type == "datetime"? "DateTime":columns[i].data_type;
                columns[i].data_type = columns[i].data_type == "datetime"? "DateTime":columns[i].data_type;
               
                // Step through the columns if it is not the last column
                if (i != columns.length - 1)
                { 
                    select_list_1 = select_list_1 + "\t" + columns[i].data_type + " " + columns[i].param_name + ";\n";
                    select_list_2 = select_list_2 + "\t\tthis." + columns[i].param_name + ",\n";
                    select_list_3 = select_list_3 + "\t\t" + columns[i].param_name +" = json['"+ columns[i].param_name + "'];\n";
                    select_list_4 = select_list_4 + "\t\tdata['" + columns[i].param_name +"'] = this."+ columns[i].param_name + ";\n";
                    select_list_5 = select_list_5 + " ${" + columns[i].param_name +"??''},";
                
                }
                else // if it is the last column
                {
                    select_list_1 = select_list_1 + "\t" + columns[i].data_type + " " + columns[i].param_name + ";\n";
                    select_list_2 = select_list_2 + "\t\tthis." + columns[i].param_name + "\n";
                    select_list_5 = select_list_5 + " ${" + columns[i].param_name +"??''}}';\n";
                    // add the pagination for the list
                    // add the column  to the order by statement
                    // exclude IPK, IFK and Bit fields from order by criteria
                    if (!(columns[i].column_name.indexOf("ipk") >= 0) && !(columns[i].column_name.indexOf("ifk") >= 0) && !columns[i].column_name.startsWith("b"))
                    {
                        select_list_4 = select_list_4 + "\t\tdata['" + columns[i].param_name +"'] = this."+ columns[i].param_name + ";\n";
                    } 
                }
            }
 
            select_list_1 = select_list_1 + "\n";  
            select_list_2 = select_list_2 + "\t});\n\n";  
            select_list_3 = select_list_3 + "\t}\n\n"; 
            select_list_4 = select_list_4 + "\t\treturn data;\n\t}\n\n"; 
            select_list_5 = select_list_5 + "\t}\n"; 
 
            var scriptsFolder = 'C:/Work/GenerateAnything/Generated/';
            this.createFolder(scriptsFolder);
            this.createFolder(scriptsFolder+ tableName+"/"); 
            this.writeFile(scriptsFolder + tableName +"/" + tableName.toLowerCase() + "_model_.dart",select_list_1 + select_list_2 + select_list_3 + select_list_4 + select_list_5 + endLine); 
        }
         
 
     GenerateProcs( dbName: string,tableName: string,  modelName: string,columns: any) : void
        {
            var select_list_1 = "USE " + dbName + "\nGO\n\n"+ 
                            "DROP PROCEDURE IF EXISTS [dbo].[" + modelName + "SelectList]; \nGO\n\n"+
                            "CREATE PROC [dbo].[" + modelName + "SelectList]\n";
            var select_list_2 = "\tSET NOCOUNT ON;\n\n\tSELECT \n";
            var select_list_from = "\tFROM " + tableName + " \n";
            var select_list_where = "\tWHERE \n";
            var select_list_4 = "\t--all fields starting with 'ipk', 'ifk' and 'b' are excluded from the order by criteria by default\n";
            select_list_4 += "\tORDER BY \n";
            var select_list_search = "\t\t AND\n\t\t--all fields starting with 'ipk', 'ifk', 'b' and 'd' are excluded from the search criteria by default\n";
            select_list_search += "\t\t(@Search IS NULL OR ((\n";

            var select_count_1 = "USE " + dbName + "\nGO\n\n"+ 
                            "DROP PROCEDURE IF EXISTS [dbo].[" + modelName + "Count]; \nGO\n\n"+
                            "CREATE PROC [dbo].[" + modelName + "Count]\n";
            var select_count_2 = "\tSET NOCOUNT ON;\n\n\tSELECT \n";
            var select_count_3 = "\tFROM " + tableName + " \n\tWHERE \n";

            var select_single_1 = "USE " + dbName + "\nGO\n\n"+ 
                            "DROP PROCEDURE IF EXISTS [dbo].[" + modelName + "SelectSingle]; \nGO\n\n"+
                            "CREATE PROC [dbo].[" + modelName + "SelectSingle]\n";
            var select_single_2 = "\tSET NOCOUNT ON;\n\n\tSELECT \n";
            var select_single_3 = "\tFROM " + tableName + " \n\tWHERE \n";

            var update_1 = "USE " + dbName + "\nGO\n\n"+ 
                            "DROP PROCEDURE IF EXISTS [dbo].[" + modelName + "Update]; \nGO\n\n"+
                            "CREATE PROC [dbo].[" + modelName + "Update]\n";
            var update_2 = "\tUPDATE " + tableName + "\n \tSET \n";
            var update_3 = "\tWHERE \n";

            var insert_1 = "USE " + dbName + "\nGO\n\n"+ 
                            "DROP PROCEDURE IF EXISTS [dbo].[" + modelName + "Insert]; \nGO\n\n"+
                            "CREATE PROC [dbo].[" + modelName + "Insert]\n";
            var insert_2 = "\tINSERT INTO " + tableName + "\n\t(\n";
            var insert_3 = "\t)\n\tVALUES\n\t(\n";

            var delete_1 = "USE " + dbName + "\nGO\n\n"+ 
                            "DROP PROCEDURE IF EXISTS [dbo].[" + modelName + "Delete]; \nGO\n\n"+
                            "CREATE PROC [dbo].[" + modelName + "Delete]\n";
            var delete_2 = "\tUPDATE " + tableName + "\n \t SET bDeleted = 1, dDateModified = GETDATE() \n";
            var delete_3 = "\tWHERE \n";

            //get last searchable field 
            var lastSearchColNames = _.filter(columns, function(column){   
                return !(column.column_name.indexOf('ipk') >= 0) && !(column.column_name.indexOf('ifk') >= 0) && !column.column_name.startsWith("b") && !column.column_name.startsWith("d") ; 
            }); 
            var lastSearchColName = ( lastSearchColNames.length)? _.last(lastSearchColNames).column_name : ''; 

            var lastOrderByColNames = _.filter(columns, function(column){   
                return !(column.column_name.indexOf('ipk') >= 0) && !(column.column_name.indexOf('ifk') >= 0) && !column.column_name.startsWith("b"); 
            });
            var lastOrderByColName = _.last(lastOrderByColNames).column_name; 
 
            var lastWhereColNames = _.filter(columns, function(column){   
                return !(column.column_name.indexOf('DateCreated') >= 0) && !(column.column_name.indexOf('DateModified') >= 0); 
            }); 
            var lastWhereColName = _.last(lastWhereColNames).column_name; 

 
            for (var i = 0; i < columns.length; i++)
            {
                if (columns[i].data_type == "varchar")
                {
                    columns[i].data_type = "varchar(" + columns[i].data_precision + ")";
                }

                // Step through the columns if it is not the last column
                if (i != columns.length - 1)
                {
                    // ****************** SELECT LIST *****************
                    // add the column to the parameter list
                    select_list_1 = select_list_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + " = NULL,\n";

                    // add the column to the select list
                    select_list_2 = select_list_2 + "\t\t" + tableName + "." + columns[i].column_name + ",\n";

                    // IF this column has a foregin constraint then add Linked table to JOIN FROM clause 
                    // console.log( JSON.stringify( columns[i].foreign_table ) );
                    if ( columns[i].foreign_table && columns[i].CheckboxSelected)
                    { 
                        if(columns[i].is_nullable == "NO" ){
                            select_list_from = select_list_from + "\tINNER JOIN " + columns[i].foreign_table + " \n";
                        }else{
                            select_list_from = select_list_from + "\tLEFT JOIN " + columns[i].foreign_table + " \n";
                        }
                          
                        select_list_from = select_list_from + "\t\tON " + columns[i].foreign_table+ "." + columns[i].foregin_column + " = " + tableName + "." + columns[i].column_name + " \n";
                    
                       //  select_list_from = select_list_from + JSON.stringify( columns[i] );
                      //  select_list_from = select_list_from + columns[i].CheckboxSelected;
                    }

                    // add the column to the where statement
                    //exclude IPK, DateCreated and DateModified from where clause 
                    if (!(columns[i].column_name.indexOf('DateCreated') >= 0) && !(columns[i].column_name.indexOf("DateModified") >= 0) && !(columns[i].column_name.indexOf("ipk") >= 0))
                    {
                        select_list_where = select_list_where + "\t\t(@" + columns[i].param_name + " IS NULL or (" + tableName + "." + columns[i].column_name + " = @" + columns[i].param_name + "))";

                        if (columns[i].column_name != lastWhereColName)
                        {
                            select_list_where += " \n\t\t AND \n";
                        }
                        else
                        {
                            select_list_where += " \n";
                        }
                    }

                    // add the column  to the order by statement
                    // exclude IPK, IFK and Bit fields from search criteria
                    if (!(columns[i].column_name.indexOf("ipk") >= 0) && !(columns[i].column_name.indexOf("ifk") >= 0) && !columns[i].column_name.startsWith("b"))
                    {
                        select_list_4 = select_list_4 + "\t\tCASE WHEN @OrderBy='" + columns[i].param_name + ".ASC' THEN " + tableName + "." + columns[i].column_name + " END ASC, \n";
                        select_list_4 = select_list_4 + "\t\tCASE WHEN @OrderBy='" + columns[i].param_name + ".DESC' THEN " + tableName + "." + columns[i].column_name + " END DESC";

                        if (columns[i].column_name != lastOrderByColName)
                        {
                            select_list_4 += ", \n";
                        }
                        else
                        {
                            select_list_4 += " \n";
                            select_list_4 += "\t\tOFFSET (@PageNumber-1)*@PageSize ROWS\n";
                            select_list_4 += "\t\tFETCH NEXT @PageSize ROWS ONLY\n";
                        }
                    }

                    // add the column to the search statement
                    // exclude IPK, IFK, Dates and Bit fields from search criteria
                    if (!(columns[i].column_name.indexOf("ipk") >= 0) && !(columns[i].column_name.indexOf("ifk") >= 0) && !columns[i].column_name.startsWith("b") && !columns[i].column_name.startsWith("d"))
                    {
                        select_list_search = select_list_search + "\t\t\t(" + tableName + "." + columns[i].column_name + " LIKE '%' + @Search + '%')";

                        if (columns[i].column_name != lastSearchColName)
                        {
                            select_list_search += " OR \n";
                        }
                        else
                        {
                            select_list_search += "\n\t\t)))\n";
                        }
                    }

                    // *************** SELECT COUNT ******************
                    // add the column to the parameter list
                    select_count_1 = select_count_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + " = NULL,\n";



                    // add the column to the where statement
                    //exclude DateCreated and DateModified from where clause
                    if (!(columns[i].column_name.indexOf("DateCreated") >= 0) && !(columns[i].column_name.indexOf("DateModified") >= 0))
                    {
                        select_count_3 = select_count_3 + "\t\t(@" + columns[i].param_name + " IS NULL or (" + tableName + "." +  columns[i].column_name + " = @" + columns[i].param_name + "))";

                        if (columns[i].column_name != lastWhereColName)
                        {
                            select_count_3 += " \n\t\t AND \n";
                        }
                        else
                        {
                            select_count_3 += " \n";
                        }
                    }

                    // ************** SELECT SINGLE ******************
                    // check if column is PK and add to parameter list
                    if (columns[i].is_PK == 1)
                        select_single_1 = select_single_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + "\n";

                    // add to the select list
                    select_single_2 = select_single_2 + "\t\t" + tableName + "." +  columns[i].column_name + ",\n";

                    // add to the where statement
                    if (columns[i].is_PK == 1)
                        select_single_3 = select_single_3 + "\t\t(" + tableName + "." +  columns[i].column_name + " = @" + columns[i].param_name + ")\n";

                    if (columns[i].is_PK == 1)
                        update_1 = update_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + ",\n";
                    else
                        update_1 = update_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + " = NULL,\n";

                    if (columns[i].is_PK == 0)
                    {
                        if ( (columns[i].column_name == "dDateCreated" ) == false)
                        {
                            if ((columns[i].column_name == "dDateModified") == true)
                                update_2 = update_2 + "\t\t\t" + tableName + "." +  columns[i].column_name + " = GETDATE(),\n";
                            else
                                update_2 = update_2 + "\t\t\t" + tableName + "." +  columns[i].column_name + " = ISNULL(@" + columns[i].param_name + "," + tableName + "." +  columns[i].column_name + "),\n";
                        }
                    }
                    if (columns[i].is_PK == 1)
                        update_3 = update_3 + "\t\t\t" + tableName + "." +  columns[i].column_name + " = @" + columns[i].param_name + "\n";

                    if (columns[i].is_PK == 1 || (columns[i].column_name == "dDateModified") || (columns[i].column_name == "dDateCreated") || (columns[i].column_name == "bDeleted"))
                        insert_1 = insert_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + " = NULL,\n";
                    else
                        insert_1 = insert_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + ",\n";

                    if (columns[i].is_PK == 0)
                    {
                        if ((columns[i].column_name == "dDateModified") == false)
                        {
                            insert_2 = insert_2 + "\t\t" + tableName + "." +  columns[i].column_name + ",\n";
                            if ((columns[i].column_name == "dDateCreated") == false)
                                insert_3 = insert_3 + "\t\t@" + columns[i].param_name + ",\n";
                            else
                                insert_3 = insert_3 + "\t\tGETDATE(),\n";
                        }
                    }

                    if (columns[i].is_PK == 1)
                        delete_1 = delete_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + "\n";
                    /*else
                        delete_1 = delete_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + "  = NULL,\n";*/

                    if (columns[i].is_PK == 1)
                        delete_3 = delete_3 + "\t\t" + columns[i].column_name + " = @" + columns[i].param_name + "\n";
                }
                else // if it is the last column
                {
                    select_list_1 = select_list_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + " = NULL,\n";
                    // adding the pagination parameters
                    var page_params = "";
                    page_params = page_params + "\t\t@Search varchar(255) = NULL,\n";
                    page_params = page_params + "\t\t@PageNumber int = 1,\n";
                    page_params = page_params + "\t\t@PageSize int = 9999,\n";
                    page_params = page_params + "\t\t@OrderBy varchar(255) = NULL\n AS \n BEGIN \n";

                    select_list_1 = select_list_1 + page_params;

                    select_list_2 = select_list_2 + "\t\t" + tableName + "." + columns[i].column_name + "\n";

                    //exclude IPK, DateCreated and DateModified from where clause
                    if (!(columns[i].column_name.indexOf("DateCreated") >= 0) && !(columns[i].column_name.indexOf("DateModified") >= 0) && !(columns[i].column_name.indexOf("ipk") >= 0))
                    {
                        select_list_where = select_list_where + "\t\t(@" + columns[i].param_name + " IS NULL or (" + tableName + "." +  columns[i].column_name + " = @" + columns[i].param_name + ")) \n";
                    }

                    // exclude IPK, IFK, Dates and Bit fields from search criteria
                    if (!(columns[i].column_name.indexOf("ipk") >= 0) && !(columns[i].column_name.indexOf("ifk") >= 0) && !columns[i].column_name.startsWith("b") && !columns[i].column_name.startsWith("d"))
                    {
                        select_list_search = select_list_search + "\t\t\t(" + tableName + "." + columns[i].column_name + " LIKE '%' + @Search + '%')\n\t\t)))\n";
                    }
                    else
                    {
                        //there were no search columns at all, replace search section with blank string
                        select_list_search += "";
                    }

                    // add the pagination for the list
                    // add the column  to the order by statement
                    // exclude IPK, IFK and Bit fields from order by criteria
                    if (!(columns[i].column_name.indexOf("ipk") >= 0) && !(columns[i].column_name.indexOf("ifk") >= 0) && !columns[i].column_name.startsWith("b"))
                    {
                        select_list_4 = select_list_4 + "\t\tCASE WHEN @OrderBy='" + columns[i].param_name + ".ASC' THEN " + tableName + "." + columns[i].column_name + " END ASC, \n";
                        select_list_4 = select_list_4 + "\t\tCASE WHEN @OrderBy='" + columns[i].param_name + ".DESC' THEN " + tableName + "." + columns[i].column_name + " END DESC \n";
                        select_list_4 = select_list_4 + "\t\tOFFSET (@PageNumber-1)*@PageSize ROWS\n";
                        select_list_4 = select_list_4 + "\t\tFETCH NEXT @PageSize ROWS ONLY\n";
                    }

                    select_count_1 = select_count_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + " = NULL,\n";
                    select_count_1 = select_count_1 + page_params;

                    // add the count to the select list
                    select_count_2 = select_count_2 + "\t\tcount(1)\n";
                    
                    //exclude DateCreated and DateModified from where clause
                    if (!(columns[i].column_name.indexOf("DateCreated") >= 0) && !(columns[i].column_name.indexOf("DateModified") >= 0))
                    {
                        select_count_3 = select_count_3 + "\t\t(@" + columns[i].param_name + " IS NULL or (" + tableName + "." +  columns[i].column_name + " = @" + columns[i].param_name + ")) \n";
                    }

                    select_single_1 = select_single_1 + "\t\t\n AS \n BEGIN \n";
                    select_single_2 = select_single_2 + "\t\t" + tableName + "." +  columns[i].column_name + "\n";
                    if (columns[i].is_PK == 1)
                        select_single_3 = select_single_3 + "\t\t(" + tableName + "." +  columns[i].column_name + " = @" + columns[i].param_name + ")\n";

                    if (columns[i].is_PK == 1)
                        update_1 = update_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + "\n AS \n BEGIN \n";
                    else
                        update_1 = update_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + " = NULL\n AS \n BEGIN \n";
                    if (columns[i].is_PK == 0)
                    {
                        if ((columns[i].column_name == "dDateCreated") == false)
                        {
                            if ((columns[i].column_name == "dDateModified") == true)
                                update_2 = update_2 + "\t\t\t" + tableName + "." +  columns[i].column_name + " = GETDATE()\n";
                            else
                                update_2 = update_2 + "\t\t\t" + tableName + "." +  columns[i].column_name + " = ISNULL(@" + columns[i].param_name + "," + tableName + "." +  columns[i].column_name + ")\n";
                        }
                    }
                    if (columns[i].is_PK == 1)
                        update_3 = update_3 + "\t\t" + tableName + "." +  columns[i].column_name + " = (@" + columns[i].param_name + "\n";

                    if (columns[i].is_PK == 1 || (columns[i].column_name == "dDateModified") || (columns[i].column_name == "dDateCreated") || (columns[i].column_name == "bDeleted"))
                        insert_1 = insert_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + " = NULL\n AS \n BEGIN \n";
                    else
                        insert_1 = insert_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + "\n AS \n BEGIN \n";

                    if (columns[i].is_PK == 0)
                    {

                        // Exclude dateModified field on the table column insert selection
                        if(columns[i].param_name == 'DateModified' ){
                            //Remove the comma of the set in the last column
                            insert_2 = insert_2.substring(0, insert_2.length - 2) + "\n";
                        } else {
                            insert_2 = insert_2 + "\t\t" + tableName + "." +  columns[i].column_name + "\n";
                        }

                        // Exclude dateModified field on the parameters insert list
                        if(columns[i].param_name == 'DateModified' ){
                            //TODO:Remove the comma of the set in the last column 
                            insert_3 =insert_3.substring(0, insert_3.length - 2)  + "\n\t)\n";  
                        } else { 
                            insert_3 = insert_3 + "\t\t@" + columns[i].param_name + "\n\t)\n"; 
                        }
                    }

                    if (columns[i].is_PK == 1)
                        delete_1 = delete_1 + "\t\t@" + columns[i].param_name + " " + columns[i].data_type + "\n AS \n BEGIN \n";
                    else
                        delete_1 = delete_1 + "\t\tAS \n BEGIN \n";
                    if (columns[i].is_PK == 1)
                        delete_3 = delete_3 + "\t\t" + columns[i].column_name + " = @" + columns[i].param_name + "\n";
                }
            }

            select_list_search = (select_list_search.length > 136)? select_list_search : '';

            select_list_4 = select_list_4 + "END";
            select_count_3 = select_count_3 + select_list_search;
            select_count_3 = select_count_3 + "END";

            select_single_3 = select_single_3 + "END";
            insert_3 = insert_3 + "\t\tSELECT SCOPE_IDENTITY()\n\nEND";
            update_3 = update_3 + "END";
            delete_3 = delete_3 + "END";
 
            var scriptsFolder = 'C:/Work/GenerateAnything/Generated/';
            this.createFolder(scriptsFolder);
            this.createFolder(scriptsFolder+ tableName+"/");
            this.writeFile(scriptsFolder + tableName +"/" + modelName + "SelectList.sql",select_list_1 + select_list_2 + select_list_from + select_list_where + select_list_search + select_list_4);
            this.writeFile(scriptsFolder + tableName +"/" + modelName + "Count.sql",select_count_1 + select_count_2 + select_count_3);
            this.writeFile(scriptsFolder + tableName +"/" + modelName + "SelectSingle.sql",select_single_1 + select_single_2 + select_single_3);
            this.writeFile(scriptsFolder + tableName +"/" + modelName + "Update.sql",update_1 + update_2 + update_3);
            this.writeFile(scriptsFolder + tableName +"/" + modelName + "Insert.sql",insert_1 + insert_2 + insert_3);
            this.writeFile(scriptsFolder + tableName +"/" + modelName + "Delete.sql",delete_1 + delete_2 + delete_3); 
        }
         
        createFile():void {
          this.writeFile("C:\\Work\\GenerateAnything\\Generated\\test.txt","Hello");
        }
        writeFile(filename,content) : void{
            var fs = require('fs');
            fs.writeFile(filename,content, function(err) {
                if(err) {
                    alert( err);
                }
                console.log( "Done writing a file");
            });        
        }  
        createFolder(dir)  : void{
            var fs = require('fs'); 

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }         
        }  

}

