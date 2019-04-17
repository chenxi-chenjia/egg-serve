var sql = `SELECT
a.id AS id,
a.username AS username,
a.password AS password,
a.state AS state,
a.salt AS salt,
a.is_system AS isSystem,
a.del_flg AS delFlg,
a.created_at AS created_at,
a.updated_at AS updated_at,
r.role_name AS role_roleName,
r.role_desc AS role_roleDesc,
r.enable AS role_enable `

module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize

    const Admin = app.model.define('Admin', {
        username: STRING,
        password: STRING,
        state: INTEGER,
        salt: STRING,
        isSystem: {
            type: INTEGER,
            field: 'is_system'
        },
        delFlg: {
            type: INTEGER,
            field: 'del_flg'
        },
    }, {
            tableName: 'admin'
        })

    // Class Method
    Admin.findUser = function (username) {
        return Admin.sequelize.query(
            `${sql}
        FROM admin a
        LEFT JOIN admin_role ar ON ar.admin_id = a.id AND ar.del_flg = 0
        LEFT JOIN role r ON r.id = ar.role_id AND r.del_flg = 0
        WHERE a.username = :username
          AND a.del_flg = 0
        `,
            {
                replacements: { username: username },
                type: Admin.sequelize.QueryTypes.SELECT
            }
        )
    }
    Admin.findAllUser = function () {
        return Admin.sequelize.query(
            `${sql}
        FROM admin a
        LEFT JOIN admin_role ar ON ar.admin_id = a.id AND ar.del_flg = 0
        LEFT JOIN role r ON r.id = ar.role_id AND r.del_flg = 0
        WHERE a.del_flg = 0
        `,
            {
                type: Admin.sequelize.QueryTypes.SELECT
            }
        )
    }

    return Admin
}