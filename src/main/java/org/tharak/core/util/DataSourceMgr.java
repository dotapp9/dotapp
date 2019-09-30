package org.tharak.core.util;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

public class DataSourceMgr {
	private static final DataSourceMgr driverMgr = new DataSourceMgr();
	private DataSource mds = null;
	private DataSourceMgr() {}
	public void setDataSource(DataSource ds) {
		mds = ds;
	}
	public static DataSourceMgr getMgr() {
		return driverMgr;
	}
	public Connection getConnection() throws SQLException{
		return mds.getConnection();  
	}
	public void close(ResultSet resultSet, Statement stmt, Connection dbcon) {
		if(resultSet != null) {
			try {
				resultSet.close();
			}catch (SQLException e) {
				// Do Nothing
			}
		}
		if(stmt != null) {
			try {
				stmt.close();
			}catch (SQLException e) {
				// Do Nothing
			}
		}
		if(dbcon != null) {
			try {
				dbcon.close();
			}catch (SQLException e) {
				// Do Nothing
			}
		}
	}
}
