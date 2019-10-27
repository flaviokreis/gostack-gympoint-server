import Mail from '../../lib/Mail';

class AnsweredMail {
  get key() {
    return 'AnsweredMail';
  }

  async handle({ data }) {
    const { student, help_order } = data;

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Solicitação respondida na Gympoint',
      template: 'help_order',
      context: {
        student: student.name,
        question: help_order.question,
        answer: help_order.answer
      }
    });
  }
}

export default new AnsweredMail();
