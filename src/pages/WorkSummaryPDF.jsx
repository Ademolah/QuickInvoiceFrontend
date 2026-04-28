import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Register a clean font (Optional: You can use standard fonts like Helvetica)
const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 30,
    marginBottom: 40,
  },
  titleSection: {
    marginBottom: 40,
  },
  sowLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0028AE',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 28,
    fontWeight: 'extrabold',
    color: '#001325',
    marginBottom: 15,
  },
  description: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 1.6,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 15,
    marginTop: 30,
  },
  deliverableRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  bullet: {
    width: 4,
    height: 4,
    backgroundColor: '#0028AE',
    borderRadius: 2,
    marginRight: 10,
  },
  deliverableText: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: 'medium',
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: '#64748B',
  },
  invoiceRef: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#001325',
    marginTop: 4,
  }
});

const WorkSummaryPDF = ({ data, invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={{ fontSize: 14, fontWeight: 'black', color: '#001325' }}>QuickInvoice</Text>
          <Text style={{ fontSize: 8, color: '#94A3B8', marginTop: 2 }}>PREMIUM FINANCIAL INFRASTRUCTURE</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Document Reference</Text>
          <Text style={{ fontSize: 9, color: '#64748B' }}>SOW-{invoice?._id.slice(-6).toUpperCase()}</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.titleSection}>
        <Text style={styles.sowLabel}>Summary of Work</Text>
        <Text style={styles.projectTitle}>{data.projectTitle || "Untitled Project Execution"}</Text>
        <Text style={styles.description}>{data.workDescription}</Text>
      </View>

      <Text style={styles.sectionLabel}>Key Deliverables & Milestones</Text>
      {data.keyDeliverables.map((item, index) => (
        item && (
          <View key={index} style={styles.deliverableRow}>
            <View style={styles.bullet} />
            <Text style={styles.deliverableText}>{item}</Text>
          </View>
        )
      ))}

      
      {/* Footer / Link */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.sectionLabel}>Linked Statement</Text>
          <Text style={styles.invoiceRef}>Invoice: {invoice?._id.slice(-6).toUpperCase() || "N/A"}</Text>
          <Text style={{ fontSize: 10, color: '#0028AE', marginTop: 2 }}>
            Amount: NGN {invoice?.total?.toLocaleString()}
          </Text>
        </View>
        <View style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
          <Text style={styles.footerText}>
            Completed on {new Date(data.completionDate).toLocaleDateString()}
          </Text>
          <Text style={[styles.footerText, { marginTop: 4 }]}>Official Client Copy</Text>
        </View>
      </View>

      {/* SURGICAL INSERTION: Branding URL */}
      <View style={{ marginTop: 25, borderTopWidth: 0.5, borderTopColor: '#F1F5F9', paddingTop: 15 }}>
        <Text style={{ 
          textAlign: 'center', 
          fontSize: 8, 
          color: '#94A3B8', 
          letterSpacing: 1.5,
          fontWeight: 'bold'
        }}>
          WWW.QUICKINVOICENG.COM
        </Text>
      </View>
    </Page>
  </Document>
);

export default WorkSummaryPDF;