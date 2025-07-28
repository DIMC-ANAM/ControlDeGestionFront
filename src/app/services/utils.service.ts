import { Injectable } from '@angular/core';
import { TipoToast } from '../../api/entidades/enumeraciones';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private toastService: ToastrService,
    
  ) { }

  MuestrasToast(tipoToast: TipoToast, mensaje: string) {
    switch (tipoToast) {
      case TipoToast.Success:
        this.toastService.success(mensaje, '', {
          closeButton: true,
          progressBar: true
        })
        break;
      case TipoToast.Error:
        this.toastService.error(mensaje, '', {
          closeButton: true,
          progressBar: true
        })
        break;
      case TipoToast.Info:
        this.toastService.info(mensaje, '', {
          closeButton: true,
          progressBar: true
        })
        break;
      case TipoToast.Warning:
        this.toastService.warning(mensaje, '', {
          closeButton: true,
          progressBar: true
        })
        break;
    }
  }

  MuestraErrorInterno(ex?: any) {
    if (ex && ex.status == 401) {
      this.toastService.info(
        'Su sesión ha vencido', '', {
        closeButton: true,
        progressBar: true
      });
    } else {
      this.toastService.error(
        ex.error.message || 'Ocurrio un error, intente mas tarde.', '', {
        closeButton: true,
        progressBar: true
      });
    }
  }

  /* convertDate(date, format) {
    let date_ = "---"
    if (date && date != "0000-00-00 00:00:00") {
      date_ = this.datePipe.transform(date, format, "UTC");
    }
    return date_;
  } */

}
