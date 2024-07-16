import { ResultSetHeader } from "mysql2";
import { getConnection } from "../../dataBase";

interface User {
    id: string;
    name: string;
    password: string;
  }

export const createUser = async (user: User): Promise<boolean> => {
  const connection = getConnection();

  try {
    const [result] = await connection.execute<ResultSetHeader>(
      "INSERT INTO tbl_member (id, name, password) VALUES (?, ?, ?)",
      [user.id, user.name, user.password]
    );

   
    if (result.affectedRows && result.affectedRows === 1) {
      return true; 
    } else {
      return false; 
    }
  } catch (error) {
    console.error("create user에러", error);
    return false; 
  }
};

