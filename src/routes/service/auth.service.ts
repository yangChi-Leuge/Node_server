import { RowDataPacket } from 'mysql2';
import { getConnection } from '../../dataBase';
import { generateAccessToken, generateRefreshToken } from '../token/token.service';

export const authenticateUser = async (id: string, password: string): Promise<{ id: string, username: string, accessToken: string, refreshToken: string } | null> => {
  const connection = getConnection();
  const [rows] = await connection.execute<RowDataPacket[]>(
    'SELECT id, username FROM users WHERE id = ? AND password = ?',
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
    username: user.username,
    accessToken,
    refreshToken
  };
};
