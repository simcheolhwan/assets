import { useRecoilValue } from "recoil"
import { Table, Tooltip } from "antd"
import { uniq } from "ramda"
import { formatAmount, formatThousandKRW, formatKRW } from "../../utils/format"
import { branchValuesQuery } from "../../database/branch"
import SetBranchItemModal from "./SetBranchItemModal"
import AddBranchModal from "./AddBranchModal"
import CommandBranch from "./CommandBranch"

const { Column } = Table

const Branch = () => {
  const branchValues = useRecoilValue(branchValuesQuery)

  const tickerList = uniq(
    branchValues.reduce<string[]>(
      (acc, { date, value, ...rest }) => [...acc, ...Object.keys(rest)],
      []
    )
  )

  return !branchValues.length ? null : (
    <>
      <Table
        dataSource={branchValues}
        pagination={false}
        rowKey="date"
        scroll={{ x: true }}
      >
        <Column dataIndex="date" title="날짜" align="center" />

        {tickerList.map((name) => (
          <Column
            dataIndex={name}
            title={name}
            render={formatAmount}
            key={name}
            align="center"
          />
        ))}

        <Column
          dataIndex="value"
          title="가치"
          render={(value) => (
            <Tooltip title={formatThousandKRW(value)}>
              {formatKRW(value)}
            </Tooltip>
          )}
          align="right"
        />

        <Column
          dataIndex="date"
          render={(date) => (
            <>
              <SetBranchItemModal date={date} />
              <AddBranchModal date={date} />
            </>
          )}
          align="center"
        />
      </Table>

      <CommandBranch />
    </>
  )
}

export default Branch
