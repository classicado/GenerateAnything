import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
  //  private translate: TranslateService
  ) {
 //   translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }


      /*
        var sql = window.require("mssql");
            // config for your database
            var config = {
                user: 'generator',
                password: 'Password1',
                server: 'MEDIAPC\\SQLEXPRESS01',  
                database: 'GeneratorDemo'  
            };

            // connect to your database
            sql.connect(config, function (err) {
            
                if (err){
                  console.log(err);
                } else{
                    // create Request object
                  var request = new sql.Request();
                     
                  // query to the database and get the records
                  request.query('select * from Users', function (err, recordset) {
                      
                      if (err) console.log(err);
                      else console.log(recordset);


                          //self.err = err;
                        //  self.recordset = recordset;
                      // send records as a response
                   //   res.send(recordset);
                      
                  });
                } 
            }); */

  }
}


