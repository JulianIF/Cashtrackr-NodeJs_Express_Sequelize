import { Column, DataType, Model, Table, HasMany, AllowNull, ForeignKey, BelongsTo } from "sequelize-typescript";
import Expense from "./Expense";
import User from './User'

@Table
({
    tableName: 'budgets'
})

class Budget extends Model
{
    @AllowNull(false)
    @Column
    ({
        type:DataType.STRING(100)
    })
    declare name:string

    @AllowNull(false)
    @Column
    ({
        type:DataType.DECIMAL
    })
    declare amount:number

    @HasMany(() => Expense, 
    {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expenses: Expense[]

    @ForeignKey(() => User)
    declare userId: number

    @BelongsTo(() => User)
    declare User: Budget
}

export default Budget