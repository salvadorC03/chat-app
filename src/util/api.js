import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";

const collectionRef = collection(db, "users");

export const existingUsername = async (username) => {
  try {
    const data = await getDocs(collectionRef);
    const users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const existingUsername = users.filter((user) => user.username === username);

    if (existingUsername.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function createUsername(email, password, username) {
  try {
    const usernameExists = await existingUsername(username);
    if (usernameExists) {
      throw new Error("USERNAME_EXISTS");
    }
    const doc = await addDoc(collectionRef, { email, password, username });
    return doc;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function findUser(email) {
  try {
    const userData = await getDocs(collectionRef);
    const users = userData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    const storedUser = users.filter((user) => user.email === email);
    console.log(storedUser);

    return {
      id: storedUser[0].id,
      email: storedUser[0].email,
      username: storedUser[0].username,
      password: storedUser[0].password,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function changeUsername(email, newUsername, currentPassword) {
  try {
    const storedUser = await findUser(email);

    const usernameExists = await existingUsername(newUsername);
    if (usernameExists) {
      throw new Error("USERNAME_EXISTS");
    }

    if (currentPassword !== storedUser.password) {
      throw new Error("WRONG_PASSWORD");
    }

    const userDoc = doc(db, "users", storedUser.id);
    const newFields = { username: newUsername };

    await updateDoc(userDoc, newFields);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function changePassword(
  currentUser,
  newPassword,
  currentPassword
) {
  try {
    await updatePassword(currentUser, newPassword);

    const storedUser = await findUser(currentUser.email);

    if (currentPassword !== storedUser.password) {
      throw new Error("WRONG_PASSWORD");
    }

    const userDoc = doc(db, "users", storedUser.id);
    const newFields = { password: newPassword };

    await updateDoc(userDoc, newFields);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function changeEmail(currentUser, newEmail, currentPassword) {
  try {
    const oldEmail = currentUser.email;
    await updateEmail(currentUser, newEmail);

    const storedUser = await findUser(oldEmail);

    if (currentPassword !== storedUser.password) {
      throw new Error("WRONG_PASSWORD");
    }

    const userDoc = doc(db, "users", storedUser.id);
    const newFields = { email: newEmail };

    await updateDoc(userDoc, newFields);
  } catch (error) {
    throw new Error(error.message);
  }
}
