const sql = `SELECT
            m.id AS id,
            m.menu_name AS menuName,
            m.menu_type AS menuType,
            m.menu_url AS menuUrl,
            m.menu_code AS menuCode,
            m.parent_id AS parentId,
            m.child_num AS childNum,
            m.listorder AS listorder,
            r.role_name AS role_roleName,
            r.role_desc AS role_roleDesc,
            r.enable AS role_enable,
            a.username AS admin_username,
            a.password AS admin_password,
            a.state AS admin_state,
            a.salt AS admin_salt,
            a.is_system AS admin_isSystem `

module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize

    const Menu = app.model.define('Menu', {
        menuName: {
            type: STRING,
            field: 'menu_name'
        },
        menuType: {
            type: STRING,
            field: 'menu_type'
        },
        menuUrl: {
            type: STRING,
            field: 'menu_url'
        },
        menuCode: {
            type: STRING,
            field: 'menu_code'
        },
        parentId: {
            type: INTEGER,
            field: 'parent_id'
        },
        childNum: {
            type: INTEGER,
            field: 'child_num'
        },
        listorder: INTEGER,
        delFlg: {
            type: INTEGER,
            field: 'del_flg'
        },
    }, {
            tableName: 'menu'
        })

    // Class Method
    Menu.findMenuByAdminId = function (adminId) {
        return Menu.sequelize.query(
            `${sql}
        FROM menu m
        LEFT JOIN role_menu rm ON rm.menu_id = m.id AND rm.del_flg = 0
        LEFT JOIN role r ON r.id = rm.role_id AND r.del_flg = 0
        LEFT JOIN admin_role ar ON ar.role_id = r.id AND ar.del_flg = 0
        LEFT JOIN admin a ON a.id = ar.admin_id AND a.del_flg = 0
        WHERE a.id = :adminId
          AND m.del_flg = 0

        UNION

        ${sql}
        FROM menu m
        LEFT JOIN role_menu rm ON rm.menu_id = m.parent_id AND rm.del_flg = 0
        LEFT JOIN role r ON r.id = rm.role_id AND r.del_flg = 0
        LEFT JOIN admin_role ar ON ar.role_id = r.id AND ar.del_flg = 0
        LEFT JOIN admin a ON a.id = ar.admin_id AND a.del_flg = 0
        WHERE a.id = :adminId
          AND m.del_flg = 0

        UNION

        ${sql}
        FROM menu m
        LEFT JOIN menu m2 ON m2.id = m.parent_id AND m2.del_flg = 0
        LEFT JOIN role_menu rm ON rm.menu_id = m2.parent_id AND rm.del_flg = 0
        LEFT JOIN role r ON r.id = rm.role_id AND r.del_flg = 0
        LEFT JOIN admin_role ar ON ar.role_id = r.id AND ar.del_flg = 0
        LEFT JOIN admin a ON a.id = ar.admin_id AND a.del_flg = 0
        WHERE a.id = :adminId
          AND m.del_flg = 0
        `,
            {
                replacements: { adminId: adminId },
                type: Menu.sequelize.QueryTypes.SELECT
            }
        )
    }

    return Menu
}