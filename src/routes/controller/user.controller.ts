import express, { Request, Response } from "express";
import { getConnection } from "../../dataBase";
import { RowDataPacket } from "mysql2";
import { getUserIdFromAccessToken } from "../token/jwt";

const router = express.Router();

router.get("/profile", async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split(" ")[1]; 

    if (!accessToken) {
        return res.status(401).json({ message: "액세스 토큰이 필요합니다." });
    }
    try {
        const userId = getUserIdFromAccessToken(accessToken);

        if (!userId) {
            return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
        }

        const connection = getConnection();

        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT id, name FROM tbl_member WHERE id = ?',
            [userId]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: "사용자를 찾을 수 없음" });
        }

        const user = userRows[0];

    
        const [postsCreatedByUser] = await connection.query<RowDataPacket[]>(
            'SELECT post_Id, title, content FROM tbl_post WHERE fk_member_id = ?',
            [userId]
        );

    
        const [likedPosts] = await connection.query<RowDataPacket[]>(
            'SELECT P.post_Id, P.title, P.content ' +
            'FROM tbl_post P ' +
            'JOIN tbl_like L ON P.post_Id = L.fk_post_Id ' +
            'WHERE L.fk_member_id = ?',
            [userId]
        );
const data = {
    id: user.id,
    name: user.name,
    postsCreatedByUser,
    likedPosts
}
        return res.status(200).json({message:"성공",
            data
           
        });
    } catch (error) {
        console.error("profile Error:", error);
        return res.status(500).json({ message: "서버 오류" });
    }
});

export default router;
