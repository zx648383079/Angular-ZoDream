export interface ITableColumn {
    label: string;
    value: string; 
}

export interface ITable {
    Auto_increment: number
    Avg_row_length: number
    Check_time: null
    Checksum: null
    Collation: string
    Comment: string
    Create_options: string
    Create_time: string
    Data_free: number
    Data_length: number
    Engine: string
    Index_length: number
    Max_data_length: number
    Name: string
    Row_format: string
    Rows: number
    Update_time: string
    Version: number,
}

export interface IColumn {
    Collation: string;
    Comment: string;
    Default: string
    Extra: string;
    Field: string;
    Key: 'PRI' | 'UQI' | '';
    Null: 'NO' | 'YES',
    Privileges: string;
    Type: string;
}

export interface IPreviewFile {
    path: string;
    content: string;
}
