"""
Unit Tests for INEP Grading Rules and Discrepancy Protocol.
Tests arithmetic consensus, discrepancy triggering (|Δ| > 80, |Δ| > 100),
Supervisor arbitration, and Human Rights violation.
"""
import pytest
from app.engine.inep_rules import INEPDiscrepancyEngine

def test_consensus_without_discrepancy():
    alfa = {"C1": 160, "C2": 160, "C3": 160, "C4": 160, "C5": 160}
    beta = {"C1": 160, "C2": 200, "C3": 160, "C4": 160, "C5": 160}
    
    has_disc, disc_comps, total_diff = INEPDiscrepancyEngine.evaluate_discrepancy(alfa, beta)
    assert not has_disc
    assert len(disc_comps) == 0
    assert total_diff == 40  # Under 100 pts threshold!

    final_scores, report = INEPDiscrepancyEngine.calculate_final_scores(alfa, beta)
    assert not report.has_discrepancy
    assert not report.auditor_intervened
    assert final_scores["C2"] == 160 or final_scores["C2"] == 200 or final_scores["C2"] == 180 or final_scores["C2"] == int(round(180/40)*40)

def test_discrepancy_per_competency_triggers_supervisor():
    # Alfa scores C1=200, Beta scores C1=80 (|200-80| = 120 > 80 pts!)
    alfa = {"C1": 200, "C2": 160, "C3": 160, "C4": 160, "C5": 160}
    beta = {"C1": 80, "C2": 160, "C3": 160, "C4": 160, "C5": 160}

    has_disc, disc_comps, total_diff = INEPDiscrepancyEngine.evaluate_discrepancy(alfa, beta)
    assert has_disc
    assert "C1" in disc_comps

    # Supervisor arbitrates C1 to 160
    auditor_scores = {"C1": 160, "C2": 160, "C3": 160, "C4": 160, "C5": 160}
    final_scores, report = INEPDiscrepancyEngine.calculate_final_scores(
        alfa, beta, auditor_scores=auditor_scores
    )
    assert report.has_discrepancy
    assert report.auditor_intervened
    assert final_scores["C1"] == 160

def test_discrepancy_total_difference_triggers_supervisor():
    # Difference of 120 in total
    alfa = {"C1": 160, "C2": 160, "C3": 160, "C4": 160, "C5": 160} # 800
    beta = {"C1": 120, "C2": 120, "C3": 160, "C4": 120, "C5": 160} # 680 (diff = 120 > 100)

    has_disc, disc_comps, total_diff = INEPDiscrepancyEngine.evaluate_discrepancy(alfa, beta)
    assert has_disc
    assert total_diff == 120

def test_human_rights_violation_zeros_c5():
    alfa = {"C1": 160, "C2": 160, "C3": 160, "C4": 160, "C5": 160}
    beta = {"C1": 160, "C2": 160, "C3": 160, "C4": 160, "C5": 160}

    final_scores, report = INEPDiscrepancyEngine.calculate_final_scores(
        alfa, beta, violates_human_rights=True
    )
    assert final_scores["C5"] == 0
    assert "Direitos Humanos" in report.final_decision_summary

def test_check_human_rights_detection():
    clean_text = "Devemos promover campanhas de conscientização nas escolas públicas."
    violating_text = "A polícia deve fazer justiça com as próprias mãos e promover o linchamento de criminosos."
    
    assert not INEPDiscrepancyEngine.check_human_rights_violation(clean_text)
    assert INEPDiscrepancyEngine.check_human_rights_violation(violating_text)
