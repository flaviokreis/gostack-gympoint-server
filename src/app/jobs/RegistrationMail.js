import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration, student, plan } = data;

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Cadastro na Gympoint',
      template: 'registration',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(
          parseISO(registration.start_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt
          }
        ),
        end_date: format(
          parseISO(registration.end_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt
          }
        ),
        price: `R$ ${plan.price.toFixed(2)}`,
        price_total: `R$ ${registration.price.toFixed(2)}`
      }
    });
  }
}

export default new CancellationMail();
