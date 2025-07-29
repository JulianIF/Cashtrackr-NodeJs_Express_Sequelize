import { Column, DataType, Model, Table,  } from "sequelize-typescript";

@Table
({
    tableName: 'budgets'
})

class Budget extends Model
{
    @Column
    ({
        type:DataType.STRING(100)
    })
    declare name:string

    @Column
    ({
        type:DataType.DECIMAL
    })
    declare amount:number
}

export default Budget