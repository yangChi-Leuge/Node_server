import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "../../dataBase";
import { env } from "../../env";
import { RowDataPacket } from "mysql2";

const router = express.Router();

router.get("/profile", async (req: Request, res: Response) => {
    const accessToken = req.headers.authorization?.split(" ")[1]; 

    if (!accessToken) {
        return res.status(401).json({ message: "액세스 토큰이 필요합니다." });
    }

    try {
        const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as { id: string };

        const connection = getConnection();

        // 사용자 정보 조회
        const [userRows] = await connection.query<RowDataPacket[]>(
            'SELECT id, name FROM tbl_member WHERE id = ?',
            [decoded.id]
        );

        if (userRows.length === 0) {
            console.log(accessToken);
            
            return res.status(404).json({ message: "사용자를 찾을 수 없음" });

        }

        const user = userRows[0];

        // 사용자가 만든 게시물 조회
        const [postsCreatedByUser] = await connection.query<RowDataPacket[]>(
            'SELECT post_Id, title, content FROM tbl_post WHERE fk_member_id = ?',
            [decoded.id]
        );

        // 사용자가 좋아요 누른 게시물 조회
        const [likedPosts] = await connection.query<RowDataPacket[]>(
            'SELECT P.post_Id, P.title, P.content ' +
            'FROM tbl_post P ' +
            'JOIN tbl_like L ON P.post_Id = L.fk_post_Id ' +
            'WHERE L.fk_member_id = ?',
            [decoded.id]
        );

        
        return res.json({
            id: user.id,
            name: user.name,
            postsCreatedByUser,
            likedPosts
        });
    } catch (error) {
        console.error("profile Error:", error);
        return res.status(500).json({ message: "서버 오류" });
    }
});

export default router;
