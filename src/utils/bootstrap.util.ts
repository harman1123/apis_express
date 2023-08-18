import { findOne, upsert } from '../helpers/db.helpers';
import AdminModel from '../models/admin.model';
import { genHash } from './common.util';

export const bootstrapAdmin = async function (cb: Function) {
  const userPassword = await genHash("admin123");
  const adminData = {
    password: userPassword,
    email: 'admin@yopmail.com',
    firstName: 'Admin',
    lastName: 'Account',
  };
  const adminDoc = await findOne(AdminModel, { email: adminData.email });
  if (!adminDoc) {
    await upsert(AdminModel, adminData)
  }

  cb();
};