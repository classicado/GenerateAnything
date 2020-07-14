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
  flutterAppPackageName: string;

  constructor(
    private router: Router,
    public sql : MssqlService
    ) {  
  }

  ngOnInit(): void {  
    this.runSQLQuery();  

    this.flutterAppPackageName = "adolftestapp";
  }
 
  connectDB(): void{ 
      this.sql.openConnection(); 
  }

  runSQLQuery(): void{
      console.log("Run in  Home page");

       this.selectedDatabaseName = this.sql.config.database;
      this.sql.query("");

      this.sql
      .getTables()
      .then( tables => {  
       // console.log( tables ); 
        this.tablesList = tables.recordset; 
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
        console.log(  cols.recordset  ); 

        this.generateFiles();
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

        this.GenerateController(
          this.selectedDatabaseName,
          this.selectedTableName,
          this.selectedTableName,
          this.getOurGeneratorFriendlyTableColumns( this.selectedColumns ) 
        ); 

        this.GenerateAPIModel(
          this.selectedDatabaseName,
          this.selectedTableName,
          this.selectedTableName,
          this.selectedColumns 
        ); 
 
        //********************************************************************
        //FOR THE FLUTTER app-
        //********************************************************************
        this.GenerateAction(
          this.selectedDatabaseName,
          this.selectedTableName,
          this.selectedTableName,
          this.selectedColumns,
          this.flutterAppPackageName
        );

        this.GenerateReducer(
          this.selectedDatabaseName,
          this.selectedTableName,
          this.selectedTableName,
          this.selectedColumns,
          this.flutterAppPackageName
        );
        //actions
        //middleware
        //models
        //reducers
        //repositories
        //states
        //configurations ***


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

        GenerateAction( dbName: string,tableName: string,  modelName: string,columns: any, packageName: string) : void
        { 
            var namespace = "namespace";
            var storedProcPrefix = "";
            var content = "";

            var fs = require('fs'); 
            fs.readFile("C:\\Work\\GenerateAnything\\src\\templates\\FlutterApp\\backend\\actions\\user_details_actions.dart", 'utf-8', (err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                } 
                content = data.toString(); 
                content = content.replace(/UserDetail/g, tableName);  
                content = content.replace(/_userDetails/g, this.camelToUnderscore(tableName));  
                content = content.replace(/user_details/g, _.snakeCase(tableName));  
                content = content.replace(/wcg_driver_app_mobile/g, packageName);  

                this.writeFile("C:/Work/GenerateAnything/Generated/flutterapp/backend/actions/" + _.snakeCase(tableName) + "_actions.dart",content); 
            });  
       }
        GenerateReducer( dbName: string,tableName: string,  modelName: string,columns: any, packageName: string) : void
        { 
            var namespace = "namespace";
            var storedProcPrefix = "";
            var content = "";

            var fs = require('fs'); 
            fs.readFile("C:\\Work\\GenerateAnything\\src\\templates\\FlutterApp\\backend\\reducers\\user_details_reducer.dart", 'utf-8', (err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                } 
                content = data.toString(); 
                content = content.replace(/UserDetail/g, tableName);  
                content = content.replace(/_userDetails/g, this.camelToUnderscore(tableName));  
                content = content.replace(/user_details/g, _.snakeCase(tableName));  
                content = content.replace(/userDetail/g, _.camelCase(tableName));  
                content = content.replace(/wcg_driver_app_mobile/g, packageName);  

/*
                console.log( this.camelToUnderscore("AdolfMapadimeng"));
                console.log( this.toSnakeCase("AdolfMapadimeng"));
                console.log( this.toLowerCamelCase("AdolfMapadimeng"));
                console.log( _.camelCase("AdolfMapadimeng"));*/

                this.writeFile("C:/Work/GenerateAnything/Generated/flutterapp/backend/reducers/" + _.snakeCase(tableName) + "_reducer.dart",content); 
            });  
       }
        
       // Helper functions 
        camelToUnderscore(str): string {
           // var result = str.replace( /([A-Z])/g, " $1" );
           // return result.split(' ').join('_').toLowerCase();
           return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        }
        toSnakeCase(str): string {
            return str.split('').map((character) => {
                if (character == character.toUpperCase()) {
                    return '_' + character.toLowerCase();
                } else {
                    return character;
                }
            })
            .join('');
        }

        toLowerCamelCase(str): string {
            return _.snakeCase(str).substring(1);
        }


      // const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        GenerateController( dbName: string,tableName: string,  modelName: string,columns: any) : void
        { 
            var namespace = "namespace";
            var storedProcPrefix = "";
            var content = "";

            var fs = require('fs'); 
            fs.readFile("C:\\Work\\GenerateAnything\\src\\templates\\controllerTemplate.txt", 'utf-8', (err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                } 
                content = data.toString();
                content = content.replace(/%NameSpace%/g, namespace);
                content = content.replace(/%ModelName%/g, tableName.replace("_", "")); //todo get from form
                content = content.replace(/%TableName%/g, tableName);
                content = content.replace(/%ProcPrefix%/g, storedProcPrefix + "_");
  
                var scriptsFolder = 'C:/Work/GenerateAnything/Generated/';
                this.createFolder(scriptsFolder);
                this.createFolder(scriptsFolder+ tableName+"/"); 
                this.writeFile(scriptsFolder + tableName +"/controller." + tableName.toLowerCase() + ".cs",content); 
            });  
       }
        GenerateAPIModel( dbName: string,tableName: string,  modelName: string,columns: any) : void
        { 
            var namespace = "namespace";
            var storedProcPrefix = "";
            var procPrefix = "";
            var content = "";

            var fs = require('fs'); 
            fs.readFile("C:\\Work\\GenerateAnything\\src\\templates\\modelTemplate.txt", 'utf-8', (err, data) => {
                if(err){
                    alert("An error ocurred reading the file :" + err.message);
                    return;
                } 
                content = data.toString();
                content = content.replace(/%NameSpace%/g, namespace);
                content = content.replace(/%ModelName%/g, tableName.replace("_", "")); //todo get from form
                content = content.replace(/%TableName%/g, tableName);
                content = content.replace(/%ProcPrefix%/g, storedProcPrefix + "_");
  



                var modelProc = "";
                if (procPrefix == "")
                {
                    modelProc = "spt" + storedProcPrefix + "_" + "" + tableName.replace("_", "") + "_";
                    content = content.replace("%ProcPrefix%", storedProcPrefix + "_");
                }
                else
                {
                    modelProc = "spt" + "_" + storedProcPrefix + "_" + "" + tableName.replace("_", "") + "_";
                    content = content.replace("%ProcPrefix%", "_" + storedProcPrefix + "_");
                }
                content = content.replace("%TableName%", tableName);


                var ListOfBaseProperties = "";
                var AddingOfBaseProperties = "";
                var StyleInfoForProperties = "";


                for (var i = 0; i < columns.length; i++)
                {
 
                    var column_name = columns[i]["COLUMN_NAME"].toString();

                    var field_name = column_name;

                    if ((field_name.Length > 3) && (field_name.substring(0, 3) == "ipk"))
                    {
                        field_name = field_name.substring(3) + "_PK";
                    }
                    else if ((field_name.Length > 3) && (field_name.substring(0, 3) == "ifk"))
                    {
                        field_name = field_name.substring(3) + "_FK";
                    }
                    else
                    {
                        field_name = field_name.substring(1);
                    }

                    var data_type = columns[i]["DATA_TYPE"].toString();

                    var is_nullable = columns[i]["IS_NULLABLE"].toString();
                    var is_PK = columns[i]["IsPartOfPrimaryKey"];

                    var data_precision = columns[i]["CHARACTER_MAXIMUM_LENGTH"]; //.toString();
                   // ColumnData col_data = new ColumnData(column_name, field_name, data_type, data_precision, is_PK);
                  //  columns.Add(col_data);

                    var style_type = "text";
                    var code_data_type = "";

                    switch (data_type)
                    {
                        case "int":
                            data_type = "DataType.dtInteger";
                            code_data_type = "int";
                            break;
                        case "uniqueidentifier":
                            data_type = "DataType.dtString";
                            code_data_type = "string";
                            break;
                        case "tinyint":
                            data_type = "DataType.dtInteger";
                            code_data_type = "int";
                            break;
                        case "varchar":
                            data_type = "DataType.dtString";
                            code_data_type = "string";
                            break;
                        case "datetime":
                            data_type = "DataType.dtDateTime";
                            code_data_type = "DateTime";
                            break;
                        case "bit":
                            data_type = "DataType.dtBoolean";
                            code_data_type = "bool";
                            break;
                        case "text":
                            data_type = "DataType.dtString";
                            code_data_type = "string";
                            break;
                        case "money":
                            data_type = "DataType.dtMoney";
                            code_data_type = "decimal";
                            break;
                        case "float":
                            data_type = "DataType.dtFloat";
                            code_data_type = "float";
                            break;
                        default:
                            data_type = "DataType.dtString";
                            code_data_type = "string";
                            break;
                    }

                    var validation_rules = "";
                    var required = "Required.rRequired";
                    var allownull = "ConvertBasePropertyAllowNull";
                    if (code_data_type != "string")
                        code_data_type = code_data_type + "?";
      
                    var identifier = "Identifier.iNotIdentifier";

                    var attribute = "";

                    if (is_PK == 1)
                    {
                        identifier = "Identifier.iIdentifier";
                        // display = "Display.dDontDisplay";
                        style_type = "hidden";
                        code_data_type = code_data_type + "";
                        attribute = "[BasePropertyInfo(Identifier = " + identifier + ", Required = " + required + ", ParamName = \"" + field_name + "\", FieldName = \"" + column_name + "\")]";
                    }
                    else
                        attribute = "[BasePropertyInfo(ParamName = \"" + field_name + "\", FieldName = \"" + column_name + "\")]";

                    if (validation_rules != "")
                        attribute = attribute + "\r\t\t[Validation(" + validation_rules + ")]";

                    ListOfBaseProperties = ListOfBaseProperties + "\r\t\t[DataMember(Name = \"" + field_name + "\")]\r\t\t" + attribute + "\r\t\tpublic " + code_data_type + " " + field_name + " { get { return handler." + allownull + "(Property(\"" + field_name + "\")); } set { var prop = this.property_list.Find(p => p.identify_name == \"" + field_name + "\"); prop.value = value; } }\r";


                    StyleInfoForProperties = StyleInfoForProperties + "\r\t\t\tthis." + field_name + ".style_info = new BaseStyleProperty(\"\", \"" + style_type + "\", \"\", null);";

                }

                content = content.replace("%ListOfBaseProperties%", ListOfBaseProperties);
                content = content.replace("%AddingOfBaseProperites%", AddingOfBaseProperties);
                content = content.replace("%StyleInfoForProperties%", StyleInfoForProperties);

                var scriptsFolder = 'C:/Work/GenerateAnything/Generated/';
                this.createFolder(scriptsFolder);
                this.createFolder(scriptsFolder+ tableName+"/"); 
                this.writeFile(scriptsFolder + tableName +"/model." + tableName.toLowerCase() + ".cs",content); 
            });  
       }

     GenerateModels( dbName: string,tableName: string,  modelName: string,columns: any) : void
        {
            var block_1 = "class " + tableName + " {\n\n";
             
            var block_2 = "\t"+ tableName +"({\n";
            var block_3 = "\t"+ tableName +".fromJson(Map<String, dynamic> json) {\n";
            var block_4 = "\tMap<String, dynamic> toJson() {\n";
                block_4 += "\t\tfinal Map<String, dynamic> data = new Map<String, dynamic>();\n";
            var block_5 = "\t@override\n\tString toString() {\n\t\treturn \n";
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
                    block_1 = block_1 + "\t" + columns[i].data_type + " " + columns[i].param_name + ";\n";
                    block_2 = block_2 + "\t\tthis." + columns[i].param_name + ",\n";
                    block_3 = block_3 + "\t\t" + columns[i].param_name +" = json['"+ columns[i].param_name + "'];\n";
                    block_4 = block_4 + "\t\tdata['" + columns[i].param_name +"'] = this."+ columns[i].param_name + ";\n";
                    block_5 = block_5 + "\t\t\t\t' ${" + columns[i].param_name +"??''},'\n";
                
                }
                else // if it is the last column
                {
                    block_1 = block_1 + "\t" + columns[i].data_type + " " + columns[i].param_name + ";\n";
                    block_2 = block_2 + "\t\tthis." + columns[i].param_name + "\n";
                    block_5 = block_5 + "\t\t\t\t' ${" + columns[i].param_name +"??''}}';\n";
                    // add the pagination for the list
                    // add the column  to the order by statement
                    // exclude IPK, IFK and Bit fields from order by criteria
                    if (!(columns[i].column_name.indexOf("ipk") >= 0) && !(columns[i].column_name.indexOf("ifk") >= 0) && !columns[i].column_name.startsWith("b"))
                    {
                        block_4 = block_4 + "\t\tdata['" + columns[i].param_name +"'] = this."+ columns[i].param_name + ";\n";
                    } 
                }
            }

            block_1 = block_1 + "\n";  
            block_2 = block_2 + "\t});\n\n";  
            block_3 = block_3 + "\t}\n\n"; 
            block_4 = block_4 + "\t\treturn data;\n\t}\n\n"; 
            block_5 = block_5 + "\t}\n"; 
 
            var scriptsFolder = 'C:/Work/GenerateAnything/Generated/';
            this.createFolder(scriptsFolder);
            this.createFolder(scriptsFolder+ tableName+"/"); 
            this.writeFile(scriptsFolder + tableName +"/" + tableName.toLowerCase() + "_model.dart",block_1 + block_2 + block_3 + block_4 + block_5 + endLine); 
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
            var mkdirp = require('mkdirp');
            var path = require('path');
            // fs.writeFile(filename,content, function(err) {
            //     if(err) {
            //         alert( err);
            //     }
            //     console.log( "Done writing a file");
            // });   


            mkdirp(path.dirname(filename), function (err) {
                if (err) return alert( err);

                fs.writeFile(filename,content, function(err) {
                    if(err) {
                        alert( err);
                    }
                    console.log( "Done writing a file");
                }); 
            });     
        }  
        createFolder(dir)  : void{
            var fs = require('fs'); 

            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }         
        }  

}

