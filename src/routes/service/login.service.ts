import { RowDataPacket } from 'mysql2';
import { getConnection } from '../../dataBase';
import { generateAccessToken, generateRefreshToken } from '../token/token.generator';

export const authenticateUser = async (id: string, password: string): Promise<{ id: string, name: string, accessToken: string, refreshToken: string } | null> => {
  const connection = getConnection();
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT id, name FROM tbl_member WHERE id = ? AND password = ?',
    [id, password]
  );

  if (rows.length === 0) {
    return null;
  }

  const user = rows[0] as { id: string, username: string };
  const accessToken = generateAccessToken({ id: user.id, username: user.username });
  const refreshToken = generateRefreshToken({ id: user.id, username: user.username });

  return {
    id: user.id,
    name: user.username,
    accessToken,
    refreshToken
  };
};
