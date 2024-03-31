import UserModel from "../schemas/User";

export const addFieldToUsers = async (name: string, defaultValue: any) => {
  try {
    // Update all documents in the user collection to add the wordSaid field
    await UserModel.updateMany({}, { $set: { [name]: defaultValue } });
    console.log("Field added to all users successfully.");
  } catch (error) {
    console.error("Error adding field to users:", error);
  }
}