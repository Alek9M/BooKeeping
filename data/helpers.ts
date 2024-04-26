import {Model, Q} from '@nozbe/watermelondb';
import {lt, weakGt} from '@nozbe/watermelondb/QueryDescription';
import {Service, ServicePrice} from '../model/service';
import BudgetTag from '../model/budgetTag';
import Calendar from '../model/calendar';
import Note from '../model/note';
import Payment from '../model/payment';
import Project from '../model/project';
import BudgetTagModel from './budgetTagModel';
import {database, EntrysModel} from './database';
import NoteModel from './noteModel';
import PaymentModel from './paymentModel';
import ProjectModel from './projectModel';
import ServiceModel from './serviceModel';
import ServicePriceModel from './servicePriceModel';

export type Weight = {
  createdAt?: Date;
  weight: string | number;
  note: string | undefined;
};

const notes = database.collections.get('notes');
const payments = database.collections.get('payments');
const projects = database.collections.get('projects');
const budgetTags = database.collections.get('budgetTags');
const services = database.collections.get('services');
const servicePrices = database.collections.get('servicePrices');

export const observeNotes = () => notes.query().observe();

export const observeBudgetTags = (type: number) =>
  budgetTags.query(Q.where('type', type)).observe();

export const observeBudgetTagsOn = (
  type: number,
  year: number,
  month: number,
) =>
  budgetTags.query(
    Q.where('type', type),
    Q.where('year', year),
    Q.where('month', month),
  );

// export const upToTodayUndoneNotes = () => {
//   const today = new Calendar();
//   return notes.query(
//     Q.where('is_done', false),
//     Q.or(
//       Q.where('date', today.dateString),
//       Q.where('year', Q.lt(today.year)),
//       Q.and(Q.where('year', today.year), Q.where('month', Q.lt(today.month))),
//       Q.and(
//         Q.where('year', today.year),
//         Q.where('month', today.month),
//         Q.where('day', Q.lt(today.day)),
//       ),
//     ),
//   );
// };
// export const futureUndoneNotes = () => {
//   const today = new Calendar();
//   return notes.query(
//     Q.where('is_done', false),
//     Q.or(
//       Q.where('year', Q.gt(today.year)),
//       Q.and(Q.where('year', today.year), Q.where('month', Q.gt(today.month))),
//       Q.and(
//         Q.where('year', today.year),
//         Q.where('month', today.month),
//         Q.where('day', Q.gt(today.day)),
//       ),
//     ),
//   );
// };
// export const lastNote = async (
//   date: string,
// ): Promise<NoteModel | undefined> => {
//   return (
//     (
//       await notes.query(Q.where('date', date), Q.where('next', null)).fetch()
//     )[0] ?? undefined
//   );
// };

// export const doneNotes = () => {
//   const today = new Calendar();
//   return notes.query(Q.where('is_done', true));
// };
export const observePayments = () => payments.query().observe();
export const observeProjects = () => projects.query();
export const observeServices = () => services.query().observe();
export const observeServicePrices = () => servicePrices.query().observe();

// export const saveNote = async (note: Note) => {
//   let previous: NoteModel | undefined = await lastNote(note.date.dateString);
//   if (previous) {
//     await updateNoteLink(previous, previous.previous, note.uuid);
//   }
//   await database.action(async () => {
//     await notes.create((entry: NoteModel) => {
//       entry.title = note.title;
//       entry.note = note.note;
//       entry.date = note.date.dateString;
//       entry.day = note.date.day;
//       entry.month = note.date.month;
//       entry.year = note.date.year;
//       entry.isDone = note.done;
//       entry.uuid = note.uuid;
//       entry.project.set(note.project?.model);
//       if (previous) {
//         entry.previous = previous.uuid;
//       }
//     });
//   });
// };

export const saveService = async (service: Service) => {
  return await database.action(async () => {
    return await services.create((entry: ServiceModel) => {
      entry.title = service.title;
      entry.uuid = service.uuid;
    });
  });
};

export const saveServicePrice = async (
  servicePrice: ServicePrice,
  service: ServiceModel,
) => {
  return await database.action(async () => {
    return await servicePrices.create((entry: ServicePriceModel) => {
      entry.price = servicePrice.price;
      entry.uuid = servicePrice.uuid;
      entry.service.set(service);
    });
  });
};

// export const findEntry = async (uuid?: string): Promise<Model | undefined> => {
//   if (uuid == undefined) {
//     return undefined;
//   }
//   const notesFound = await notes.query(Q.where('uuid', uuid)).fetch();
//   const paymentsFound = await payments.query(Q.where('uuid', uuid)).fetch();

//   switch (notesFound.length + paymentsFound.length) {
//     case 1:
//       return notesFound[0] ?? paymentsFound[0];
//     case 0:
//       return undefined;
//     default:
//       throw new Error(`More than 1 entry was found with uuid ${uuid}`);
//   }
// };

// export const findNote = async (uuid: string): Promise<Model | undefined> => {
//   const findings = await notes.query(Q.where('uuid', uuid)).fetch();
//   if (findings.length == 1) {
//     return findings[0];
//   } else {
//     return undefined;
//   }
// };

// export const savePayment = async (payment: Payment) => {
//   await database.action(async () => {
//     await payments.create((entry: PaymentModel) => {
//       entry.title = payment.title;
//       entry.date = payment.date.dateString;
//       entry.day = payment.date.day;
//       entry.month = payment.date.month;
//       entry.year = payment.date.year;
//       entry.type = payment.type;
//       entry.contact = payment.contact!.recordID;
//       entry.amount = payment.totalAmount;
//       entry.isDone = payment.done;
//       entry.uuid = payment.uuid;
//       entry.project.set(payment.project?.model);
//     });
//   });
// };

export const saveBudgetTag = async (tag: BudgetTag) => {
  return await database.action(async () => {
    return await budgetTags.create((record: BudgetTagModel) => {
      record.title = tag.title;
      record.month = tag.month;
      record.year = tag.year;
      record.type = tag.type;
      record.amount = tag.amount;
      record.uuid = tag.uuid;
      record.project.set(tag.project?.model);
    });
  });
};

export const saveProject = async (project: Project) => {
  await database.action(async () => {
    await projects.create((entry: ProjectModel) => {
      entry.name = project.name;
      entry.type = project.type;
      entry.color = project.color;
      entry.uuid = project.uuid;
    });
  });
};

// export const updateNote = async (note: Note) => {
//   await database.action(async () => {
//     await note.model?.update((entry: NoteModel) => {
//       entry.title = note.title;
//       entry.note = note.note;
//       entry.date = note.date.dateString;
//       entry.day = note.date.day;
//       entry.month = note.date.month;
//       entry.year = note.date.year;
//       entry.isDone = note.done;
//       entry.project.set(note.project?.model);
//       entry.previous = note.previous;
//       entry.next = note.next;
//     });
//   });
// };

// const updateNoteLink = async (
//   note: NoteModel,
//   previous?: string,
//   next?: string,
// ) => {
//   await database.action(async () => {
//     await note.update((entry) => {
//       if (previous) {
//         entry.previous = previous;
//       }
//       if (next) {
//         entry.next = next;
//       }
//     });
//   });
// };

// export const updateNotesLinks = async (notes: Note[]) => {
//   await database.action(async () => {
//     for (let i = 0; i < notes.length; i++) {
//       await notes[i].model?.update((entry: EntryModel) => {
//         entry.previous = notes[i].previous;
//         entry.next = notes[i].next;
//       });
//     }
//   });
// };

// export const updateProject = async (project: Project) => {
//   await database.action(async () => {
//     await project.model?.update((entry: ProjectModel) => {
//       entry.name = project.name;
//       entry.type = project.type;
//       entry.color = project.color;
//     });
//   });
// };

// export const deleteNote = async (note: NoteModel) => {
//   if (note.previous) {
//     let previous: NoteModel =
//       (await notes.query(Q.where('uuid', note.previous)).fetch())[0] ??
//       undefined;
//     if (previous) {
//       await updateNoteLink(previous, previous.previous, note.next);
//     }
//   }
//   if (note.next) {
//     let next: NoteModel =
//       (await notes.query(Q.where('uuid', note.next)).fetch())[0] ?? undefined;
//     if (next) {
//       await updateNoteLink(next, note.previous, next.next);
//     }
//   }
//   await database.action(async () => {
//     await note.destroyPermanently();
//   });
// };

// export const deletePayment = async (payment: PaymentModel) => {
//   await database.action(async () => {
//     await payment.destroyPermanently();
//   });
// };
