import { Component, OnInit } from '@angular/core';

import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  questions = [
    {
      "question": "¿Cómo comprar en Mi Refri?",
      "answer": [
        "Para buscar el producto que tienes en mente, debes elegir entre las categorías que tenemos disponibles o utilizar la barra de búsqueda de acuerdo a las características de lo que deseas.",
        "Selecciona los productos que desees y la cantidad. Cuando tengas listo tu pedido, ve al carrito haciendo clic en el icono que está ubicado en la esquina superior derecha de la pantalla.",
        "Una vez estés en el carrito verifica tus productos, selecciona la elección de envió y haz clic en Pagar, posterior a esto ingresar tus datos adicionales y de envío.",
        "Elige el método de pago de tu preferencia. Puedes elegir entre: Transferencia Bancaria directa a Bancolombia, Davivienda, Nequi o Daviplata, Pagos con cualquier tarjeta de débito o crédito, Pago en efectivo y Pago contraentrega.",
        "Una vez elegido el medio de pago haz clic en realizar pedido. Sigues los pasos dependiendo del medio de pago elegido y recibirás una notificación inmediata."
      ]
    },
    {
      "question": "¿Necesito crear una cuenta para hacer la compra?",
      "answer": [
        "No, una cuenta no es necesario. Pero debes de iniciar sesión con tu cuenta de Google o Facebook para realizar el proceso de compra."
      ]
    },
    {
      "question": "¿Cómo comprar por WhatsApp?",
      "answer": [
        "Puedes comunicarte con nuestra línea de ventas de WhatsApp, preguntarnos y asesorarte sobre tus productos favoritos. Uno de nuestros asesores tomará tu pedido, resolverá tus dudas y te ofrecerá los medios de pagos disponibles. Tomara tus datos personales y de envió. Una vez confirmado tu pedido y dependiendo del medio de pago elegido recibirás una notificación de tu pedido. Recuerda que al utilizar estos canales de pedidos estás aceptando nuestros términos y condiciones asi como las  politicas de tratamiento de datos."
      ]
    },
    {
      "question": "¿Qué pasa una vez reciben mi pedido?",
      "answer": [
        "Cuando hayas realizado el pedido y el pago recibirás un correo de confirmación al correo con el que iniciaste sesión (recuerda revisar la bandeja de spam Y correos no deseados). Nosotros haremos el proceso de despacho según nuestros días hábiles."
      ]
    },
    {
      "question": "¿Cuáles con los medios de pagos que puedo elegir en Mi Refri?",
      "answer": [
        "En Mi Refri puedes elegir pagar con efectivo para esta opción recuerda tener el valor exacto de tu pedido.",
        "Transferencia Bancaria directa a Bancolombia, Davivienda, Nequi o Daviplata, para estas opciones debes realizar tu pago con anticipación.",
        "Cualquier tarjeta de débito o crédito"
      ]
    },
    {
      "question": "¿Los precios incluyen envió?",
      "answer": [
        "No, el valor del envió está sujeto a la ubicación. En el carrito será añadido el valor mínimo de envío que es de $3.000.",
        "El valor puede variar de acuerdo a la zona, se te notificará por el WhatsApp o por correo si tu valor está sujeto a un valor adicional."
      ]
    }
  ];

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {
  }

  sendSupport(type: string) {
    switch (type) {
      case 'whatsapp':
        window.open("https://api.whatsapp.com/send?phone=573222308028&text=Hola,%20necesito%20de%20tu%20ayuda%20en%20la%20aplicación%20Mi%20Refri%20🙋🫶");        
        break;
      case 'instagram':
        window.open("https://instagram.com/davdevco");
        break;
      case 'facebook':
        window.open("https://facebook.com/DavDev-CO-106204882061565");
        break;
      case 'google':
        window.open("mailto:davdevco@gmail.com");
        break;            
      default:
        window.open("https://api.whatsapp.com/send?phone=573222308028&text=Hola,%20necesito%20de%20tu%20ayuda%20en%20la%20aplicación%20Mi%20Refri%20🙋🫶");
        break;
    }
  }
}
